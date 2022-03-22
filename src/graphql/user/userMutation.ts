import { GraphQLObjectType, GraphQLString } from "graphql";
import { userLogin } from "./userSchema";
import { sign } from "jsonwebtoken";
import removeTags from "../../modules/XSS";
import hashMaker from "../../modules/modules";
import { userModel } from "../../db/models";
import { secret } from "../../modules/modules";
import create_file from "../../modules/create_file";
import { userInfo } from "../..";
import { create_verify_hash, check_verify_hash } from "../../modules/verify_hash";
import code_generator from "../../modules/code_generator";
import send_email from "../../modules/send_email/send_email";


const verify_hash = new GraphQLObjectType({
  name: "verify_hash",
  fields: {
    error: { type: GraphQLString },
    verify_hash: { type: GraphQLString },
  }
});

export const userMutation = {
  Register_1: {
    type: verify_hash,
    args: {
      email: { type: GraphQLString }
    },
    resolve: async (parent: any, args: any) => {

      //step 1 => sanitize the input data

      const _id = removeTags(args.email);

      //step 2 => check data base for found an user with input username
      try {

        const checkNotExist = await userModel.findOne({ _id });
        // step 2 ===> if user founded server will rejected an error...
        if (checkNotExist) throw "you are registered later";

      } catch (error) {
        return { error };
      }

      //step 3 => server send an email to input email for validate

      //generate a 6 character random code :
      const code = code_generator(6);

      send_email({
        getter: _id,
        title: "verify code",
        code
      });

      const verify_hash = create_verify_hash({ email: _id, code });

      return { error: null, verify_hash }

    },
  },

  Register_2: {
    type: userLogin,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      code: { type: GraphQLString },
      verify_hash: { type: GraphQLString },
      fullName: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {

      //sanitize input data's :
      const _id = removeTags(args.email),
        password = removeTags(args.password),
        code = removeTags(args.code),
        input_verify_hash = removeTags(args.verify_hash),
        fullName = removeTags(args.fullName);

      //verify code an email width verify_hash

      const verify_hash_result = check_verify_hash({
        email: _id,
        code,
        input_verify_hash
      });

      //reject error if verify_hash and generated hash has conflict

      if (!verify_hash_result) return { error: 'your code not valid' }

      //create a user in database


      const checkNotExist = await userModel.findOne({ _id });
      //create user if not created later...
      var result: any = {};
      if (!checkNotExist) {
        const newUser = new userModel({
          _id,
          password,
          fullName,
        });
        result = await newUser.save();
      }

      //create a folder with user.json file within

      create_file({ _id });

      //create token

      const token = sign({ _id }, secret);

      //return token

      return { user: result, token };

    }
  }
};

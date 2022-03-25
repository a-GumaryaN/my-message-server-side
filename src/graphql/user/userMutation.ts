import { GraphQLObjectType, GraphQLString } from "graphql";
import { user, userLogin, inputUser } from "./userSchema";
import { sign } from "jsonwebtoken";
import removeTags from "../../modules/XSS";
import hashMaker from "../../modules/modules";
import { userModel } from "../../db/models";
import { secret } from "../../modules/modules";
import create_file from "../../modules/create_file";
import { userInfo } from "../..";
import code_generator from "../../modules/code_generator";
import send_email from "../../modules/send_email/send_email";
import { verifyCode } from "../../db/models";


const verify_hash = new GraphQLObjectType({
  name: "verify_hash",
  fields: {
    error: { type: GraphQLString },
    verify_hash: { type: GraphQLString },
  }
});

export const userMutation = {
  setVerifyCode: {
    type: verify_hash,
    args: {
      email: { type: GraphQLString }
    },
    resolve: async (parent: any, args: any) => {

      //step 1 => sanitize the input data

      const _id = removeTags(args.email);

      //step 2 => check data base for found an user with input username
      try {

        const checkNotExist = await verifyCode.findOne({ _id });
        // step 2 ===> if user founded server will rejected an error...
        if (checkNotExist) throw "you are register later";

      } catch (error) {
        return { error };
      }

      //generate a 6 character random code :
      const code = code_generator(6);

      //set a verify code in database:
      try {

        const newVerifyCode = new verifyCode({
          _id,
          code
        });

        await newVerifyCode.save();

      } catch (error) {
        return { error };
      }

      //...send email part

      // send_email({
      //   getter: _id,
      //   title: "verify code",
      //   code
      // });

      return { error: null, verify_hash }

    },
  },
  checkVerifyCode: {
    type: new GraphQLObjectType({
      name: "verify_code",
      fields: {
        error: { type: GraphQLString }
      }
    }),
    args: {
      email: { type: GraphQLString },
      code: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {
      const _id = removeTags(args.email),
        code = removeTags(args.code);
      try {

        const checkExist = await verifyCode.findOne({ _id });
        // step 2 ===> if user founded server will rejected an error...
        if (!checkExist) throw "code not set";

        if (code !== checkExist.code) throw 'your code not valid';

        return {}

      } catch (error) {
        return { error };
      }
    }
  },

  Register: {
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
        password = hashMaker(removeTags(args.password), 'md5', 'utf-8', 'hex'),
        code = removeTags(args.code),
        fullName = removeTags(args.fullName);

      try {

        const checkExist = await verifyCode.findOne({ _id });
        // step 2 ===> if user founded server will rejected an error...
        if (!checkExist) throw "code not set";

        if (code !== checkExist.code) throw 'your code not valid';

      } catch (error) {
        return { error };
      }

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

      const token = sign({ _id, fullName }, secret);

      //return token

      return { user: result, token };

    }
  },
  updateUser: {
    type: user,
    args: {
      user: { type: inputUser }
    },
    resolve: async (parent: any, args: any) => {

      if (!userInfo.username) return { error: 'access denied' }

      const _id = userInfo.username;
      
      const user = args.user;

      try {
        await userModel.updateOne({ _id }, user);

        const result = await userModel.findById({ _id });

        return { result }

      } catch ({ message }) {

        return { error: message }

      }

    }
  }
};

import { GraphQLObjectType, GraphQLString } from "graphql";
import { userLogin } from "./userSchema";
import { sign } from "jsonwebtoken";
import removeTags from "../../modules/XSS";
import hashMaker from "../../modules/modules";
import { userModel } from "../../db/models";
import { secret } from "../../modules/modules";

export const userMutation = {
  Register: {
    type: userLogin,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      fullName: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {
      const _id = removeTags(args.email),
        fullName = removeTags(args.fullName),
        password = hashMaker(removeTags(args.password));
      try {
        const checkNotExist = await userModel.findOne({ _id });
        if (checkNotExist) throw "user registered later";

        const newUser = new userModel({
          _id,
          password,
          fullName,
        });

        const result = await newUser.save();

        const token = sign({ _id }, secret, { expiresIn: "2d" });

        return { user: result, token };
      } catch (error) {
        return { error };
      }
    },
  },
};

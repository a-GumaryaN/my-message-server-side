import { GraphQLObjectType, GraphQLString } from "graphql";
import { userLogin } from "./userSchema";
import { sign } from "jsonwebtoken";
import removeTags from "../../modules/XSS";
import hashMaker from "../../modules/modules";
import { userModel } from "../../db/models";
import { secret } from "../../modules/modules";

export const userQuery = {
  login: {
    type: userLogin,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {
      const _id = removeTags(args.email),
        password = hashMaker(removeTags(args.password));
      try {
        const result = await userModel.findOne({ _id });
        if (!result) throw "user not found";

        if (result.password !== password) throw "invalid password";

        const token = sign({ _id }, secret, { expiresIn: "2d" });

        return { user: result, token };
      } catch (error) {
        return { error };
      }
    },
  },
};

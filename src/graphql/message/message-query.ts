import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { messageModel } from "../../db/models";

import removeTags from "../../modules/XSS";

import message from "./message-schema";

const messageQuery = {
  message: {
    type: GraphQLList(message),
    args: {
      limit: { type: GraphQLInt },
      communityName: { type: GraphQLString },
      time: { type: GraphQLString },
    },
    resolve: async (parents:any, args:any) => {
      const communityName = removeTags(args.communityName);
      // time = args.time ? removeTags(args.time) : "";

      const result = await messageModel.find({ communityName }).limit(args.limit);

      return result;
    },
  },
};

export default messageQuery;

import { GraphQLString } from "graphql";

import { chanelModel } from "../../db/models";

import removeTags from "../../modules/XSS";

import { chanel } from "../chanel/chanel-schema";

const chanelQuery = {
  chanel: {
    type: chanel,
    args: {
      chanelName: { type: GraphQLString },
    },
    resolve: async (parent:any, args:any) => {
      const _id = removeTags(args.chanelName);
      const result: any = await chanelModel.findOne({ _id });
      result.chanelName = result._id;
      return result;
    },
  },
};

export default chanelQuery;

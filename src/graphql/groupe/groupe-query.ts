import { GraphQLString } from "graphql";

import { chanelModel } from "../../db/models";

import removeTags from "../../modules/XSS";

import { groupe } from "./groupe-schema";

export const groupeQuery = {
  chanel: {
    type: groupe,
    args: {
      groupeName: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {
      const _id = removeTags(args.groupeName);
      const result: any = await chanelModel.findOne({ _id });
      return result;
    },
  },
};

// export default groupeQuery;

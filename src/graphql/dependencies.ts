import { GraphQLObjectType, GraphQLString } from "graphql";

export const result = new GraphQLObjectType({
  name: "result",
  fields: {
    error: { type: GraphQLString },
    result: { type: GraphQLString },
  },
});

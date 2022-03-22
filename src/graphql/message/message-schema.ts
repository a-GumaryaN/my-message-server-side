import { GraphQLObjectType, GraphQLString } from "graphql";

export const message = new GraphQLObjectType({
  name: "messageSchema",
  fields: {
    time: { type: GraphQLString },
    communityName: { type: GraphQLString },
    msg: { type: GraphQLString },
    msgOwner: { type: GraphQLString },
  },
});

export default message;

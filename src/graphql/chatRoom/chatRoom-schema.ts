import { GraphQLObjectType, GraphQLString } from "graphql";

import message from "../message/message-schema";

const chatRoom = new GraphQLObjectType({
  name: "chatRoom",
  fields: {
    user1: { type: GraphQLString },
    user2: { type: GraphQLString },
    messages: { type: message },
  },
});

export default chatRoom;

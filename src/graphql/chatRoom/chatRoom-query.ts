import chatRoom from "./chatRoom-schema";
import { GraphQLString } from "graphql";
import { chatRoomModel } from "../../db/models";
import { userInfo } from "../../index";
const chatRoomQuery = {
  chatRoom: {
    type: chatRoom,
    args: { secondUserId: { type: GraphQLString } },
    resolve: async (parent:any, args:any) => {
      if (!userInfo.username) return { error: "access denied..." };
      const secondUserId = args.secondUserId;
      const result = await chatRoomModel.findOne({
        $or: [
          { _id: secondUserId + userInfo.username },
          { _id: userInfo.username + secondUserId },
        ],
      });
      return { result };
    },
  },
};

export default chatRoomQuery;

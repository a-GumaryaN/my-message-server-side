import {
  GraphQLString,
} from "graphql";

import { messageModel } from "../../db/models";

import removeTags from "../../modules/XSS";

import { result } from "../dependencies";

import { userInfo } from "../../index";

const messageMutation = {
  addMessage: {
    type: result,
    args: {
      communityName: { type: GraphQLString },
      msgOwner: { type: GraphQLString },
      msg: { type: GraphQLString },
      time: { type: GraphQLString },
    },
    resolve: async (parents:any, args:any) => {
      const communityName = removeTags(args.communityName),
        msgOwner = removeTags(args.msgOwner),
        msg = removeTags(args.msg),
        time = removeTags(args.time);

      const checkNotExist = await messageModel.findOne({ time });

      if (checkNotExist) return { error: "message saved last..." };

      const newMessage = new messageModel({
        communityName,
        msgOwner,
        msg,
        time,
      });

      try {
        await newMessage.save();
      } catch (error) {
        return { error };
      }

      return { result: "message saved successfully..." };
    },
  },
  updateMessage: {
    type: result,
    args: {
      communityName: { type: GraphQLString },
      newMsg: { type: GraphQLString },
      time: { type: GraphQLString },
    },
    resolve: async (parents:any, args:any) => {
      if (userInfo.username) {
        const communityName = removeTags(args.communityName),
          newMsg = removeTags(args.newMsg),
          time = removeTags(args.time);

        const checkOwner = await messageModel.findOne({ communityName, time });

        if (!checkOwner) return { error: "message not found..." };

        if (checkOwner.msgOwner !== userInfo.username)
          return { error: "access denied in message author..." };

        try {
          const result:any =await messageModel.updateOne(
            {
              communityName,
              time,
              msgOwner: userInfo.username,
            },
            {
              msg: newMsg,
            }
          );
        } catch (error) {
          return { error };
        }

        return {
          result: `message updated successfully`,
        };
      } else {
        return { error: "access denied: not authenticated..." };
      }
    },
  },
};

export default messageMutation;

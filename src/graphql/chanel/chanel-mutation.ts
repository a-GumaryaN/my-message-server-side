import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { chanelModel } from "../../db/models";

import removeTags from "../../modules/XSS";

import { result } from "../dependencies";

import { chanel, inputChanel } from "../../graphql/chanel/chanel-schema";

import { userInfo } from "../../index";

const chanelMutation = {
  addChanel: {
    type: result,
    args: {
      _id: { type: GraphQLString },
      description: { type: GraphQLString },
    },
    resolve: async (parent:any, args:any) => {
      if (!userInfo.username) return { error: "access denied..." };

      const _id = removeTags(args._id);

      const description = args.description
        ? removeTags(args.description)
        : null;

      const checkNotExist = await chanelModel.findOne({ _id });

      if (checkNotExist) return { error: "chanel exist..." };

      const newChanel = new chanelModel({
        _id: _id,
        owner: userInfo.username,
        description: description,
      });
      const result = await newChanel.save();

      if (result) return { result: "chanel added successfully..." };
    },
  },
  updateChanel: {
    type: result,
    args: {
      _id: { type: GraphQLString },
      update: { type: inputChanel },
    },
    resolve: async (parent:any, args:any) => {
      const _id = removeTags(args._id),
        checkExist = await chanelModel.findOne({ _id });

      if (!checkExist) return { error: "chanel not found..." };

      if (checkExist.owner !== userInfo.username)
        return { error: "other user can not update a chanel..." };

      const result: any = await chanelModel.updateOne(
        {
          _id,
        },
        args.update
      );

      return { result: `modified count : ${result.modifiedCount}` };
    },
  },
  subscribe: {
    type: result,
    args: {
      subscriber_id: { type: GraphQLString },
      chanel_id: { type: GraphQLString },
    },
    resolve: async (parent:any, args:any) => {
      const subscriber_id = removeTags(args.subscriber_id),
        chanel_id = removeTags(args.chanel_id);

      if (userInfo.username !== subscriber_id)
        return {
          error: "Other users can no longer subscribe a user in a group",
        };

      const checkChanelExist = await chanelModel.findOne({ _id: chanel_id });
      if (!checkChanelExist)
        return { error: "chanel for subscribe not exist..." };
      if (checkChanelExist.owner === userInfo.username)
        return { error: "user can not subscribe his/her chanels..." };

      if (checkChanelExist.subscribers.includes(subscriber_id))
        return { error: "subscriber exist" };

      const result:any = await chanelModel.updateOne(
        { _id: chanel_id },
        { $push: { subscribers: subscriber_id } }
      );

      return { result: result.modifiedCount };
    },
  },
  deleteChanel: {
    type: result,
    args: {
      _id: { type: GraphQLString },
    },
    resolve: async (parent:any, args:any) => {
      const _id = args._id;
      const checkOwner = await chanelModel.findOne({ _id });
      if (userInfo.username !== _id)
        return { error: "only owner of chanel can remove that..." };
      const result = await chanelModel.deleteOne({ _id });
      return { result };
    },
  },
};

export default chanelMutation;

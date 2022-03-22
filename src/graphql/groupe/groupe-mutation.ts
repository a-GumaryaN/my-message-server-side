import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { userModel, groupeModel, messageModel } from "../../db/models";

import removeTags from "../../modules/XSS";

import { result } from "../dependencies";

import { inputGroupe, groupe } from "./groupe-schema";

import { userInfo } from "../../index";

export const groupeMutation = {
  addGroupe: {
    type: groupe,
    args: {
      groupeName: { type: GraphQLString },
      members: { type: GraphQLList(GraphQLString) },
    },
    resolve: async (parent:any, args:any) => {
      if (!userInfo.username) return { error: "access denied..." };

      const groupeName = removeTags(args.groupeName),
        checkExist = await groupeModel.findOne({ _id: groupeName });

      if (checkExist) return { error: "groupe exist..." };

      //*****************issue in add some members in first adding groupe********************

      // const members = [];

      // args.members.map((item) => {
      //   members.push(removeTags(item));
      // });

      const newGroupe = new groupeModel({
        _id: groupeName,
        owner: userInfo.username,
        members: args.members,
      });

      const result = await newGroupe.save();

      return { result };
    },
  },
  joinToGroupe: {
    type: result,
    args: {
      groupeName: { type: GraphQLString },
    },
    resolve: async (parent:any, args:any) => {
      if (!userInfo.username) return { error: "access denied..." };

      const groupeName = removeTags(args.groupeName),
        checkExist = await groupeModel.findOne({ _id: groupeName });

      if (!checkExist) return { error: "groupe not exist..." };

      if (checkExist.owner === userInfo.username)
        return { error: "user can no longer subscribed his/her groupe..." };

      let checkIsSubscriber = false;
      checkExist.members.map((item) => {
        if (item === userInfo.username) checkIsSubscriber = true;
      });

      if (checkIsSubscriber)
        return { error: "members exist in groupe members..." };

      const result = await groupeModel.updateOne(
        {
          _id: groupeName,
        },
        {
          $push: { members: [userInfo.username] },
        }
      );

      return { result };
    },
  },
  // updateGroupe: {
  //   type:result
  // },
  // addMember: {},
};

// export default groupeMutation;

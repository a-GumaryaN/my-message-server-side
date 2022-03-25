import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";

export const user = new GraphQLObjectType({
  name: "user",
  fields: {
    error: { type: GraphQLString },
    _id: { type: GraphQLString },
    password: { type: GraphQLString },
    fullName: { type: GraphQLString },
    profileImage: { type: GraphQLString },
  },
});

export const inputUser = new GraphQLInputObjectType({
  name: "user_input",
  fields: {
    password: { type: GraphQLString },
    fullName: { type: GraphQLString },
    profileImage: { type: GraphQLString },
  },
});

export const userLogin=new GraphQLObjectType({
  name:"userLogin",
  fields:{
    error:{type:GraphQLString},
    user:{type:user},
    token:{type:GraphQLString}
  }
});

import { GraphQLObjectType, GraphQLString } from "graphql";

const user = new GraphQLObjectType({
  name: "user",
  fields: {
    error:{type:GraphQLString},
    _id: { type: GraphQLString },
    password: { type: GraphQLString },
    fullName: { type: GraphQLString },
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

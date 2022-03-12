import { GraphQLObjectType, GraphQLString } from "graphql";
import { userQuery } from "./user/userQuery";
import { userLogin } from "./user/userSchema";



export const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...userQuery,
  },
});

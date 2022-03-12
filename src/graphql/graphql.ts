import { GraphQLSchema } from "graphql";
import { query } from "./query";
import { mutation } from "./mutation";

export const graphqlSchema = new GraphQLSchema({
  query,
  mutation,
});

import { GraphQLSchema } from "graphql";
import { query } from "./query";
import { mutation } from "./mutation";

const graphqlSchema = new GraphQLSchema({
  query,
  mutation,
});

export default graphqlSchema;
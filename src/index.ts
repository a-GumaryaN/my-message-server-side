import Server from "./Server";
import { userModel } from "./db/models";
import { graphqlHTTP } from "express-graphql";
import { graphqlSchema } from "./graphql/graphql";
const cors = require("cors");

const server = new Server(4000, "mongodb://localhost:27017/cryptex");

server.app.use(cors({ origin: "*" }));

server.app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
  })
);

server.init();

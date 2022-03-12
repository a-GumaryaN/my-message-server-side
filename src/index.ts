import Server from "./Server";
const cors = require("cors");

const server = new Server(4000, "mongodb://localhost:27017/cryptex");

server.app.use(cors({ origin: "*" }));


server.init();

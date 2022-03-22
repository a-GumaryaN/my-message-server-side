import Server from "./Server";

const server = new Server(4000, "mongodb://localhost:27017/socketIo");

server.init();

export const userInfo = server.userInfo;

server.listen();

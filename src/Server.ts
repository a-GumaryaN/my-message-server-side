import * as express from "express";
import { createServer } from "http";
import { connect } from "mongoose";

class Server {
  private port: number;
  private dbUrl: string;
  public app: any;
  public server: any;

  constructor(
    port: number = 3000,
    dbUrl: string = "mongodb://localhost:27017/testDB"
  ) {
    this.port = port;
    this.dbUrl = dbUrl;
    this.app = express();
    this.server = createServer(this.app);
  }

  init = async () => {
    try {
      connect(this.dbUrl).then(() => {
        console.log("successfully connected to the database");
      });

      this.server.listen(this.port, () => {
        console.log(`server is running on port ${this.port}`);
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export default Server;

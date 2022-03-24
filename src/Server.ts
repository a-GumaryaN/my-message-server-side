import * as express from "express";
import { createServer } from "http";
// import { createServer } from "https";
import { connect } from "mongoose";
// import { Server } from "socket.io";
// import { socket } from "./api/socket-module";
import { readFileSync, existsSync } from "fs";
import * as fs from "fs-extra";
import { join } from "path";
import { auth } from "./modules/auth";
import * as busboy from "connect-busboy";
import { secret } from "./modules/modules";
import removeTags from "./modules/XSS";
import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./graphql/graphql";
import { userInfo } from ".";
const cors = require("cors");

class server {
  //initialize server parameter
  public app: any;
  private server: any;
  private portNumber: number = 3000;
  private dbUrl = "mongodb://localhost:27017/my-message";
  public io: any;
  public userInfo: any = {
    username: ""
  };
  public serverHttpsOptions = {
    cert: readFileSync(join(__dirname, "certs", "ca.crt")),
    key: readFileSync(join(__dirname, "certs", "ca.key")),
  };

  //server constructor
  constructor(portNumber: number, dbUrl: string) {
    this.dbUrl = dbUrl;
    this.portNumber = portNumber;
  }

  //server initialize method
  public init = async () => {
    this.app = express();
    this.server = createServer(this.app);
    // this.io = new Server(this.server);

    this.app.use(cors({ origin: "*" }));

    this.app.use(busboy());

    await connect(this.dbUrl).then(() => {
      console.log(`successfully connected to the database...`);
    });

    //route for authentication with client's jwt
    this.app.use("", (req: any, res: any, next: Function) => {
      const inputToken: any = req.headers.token;

      if (!inputToken) {
        console.log("not entered...");
      }


      if (inputToken) {
        const token = removeTags(inputToken);

        const authResult: { username?: string; error?: string } = auth(
          token,
          secret
        );

        if (authResult.error) {
          return { error: authResult.error };
        }

        this.userInfo.username = authResult.username;

        console.log("entered...");
      }
      next();
    });


    //upload files route
    this.app.post("/upload", (req: any, res: any) => {
      //authentication

      if (!this.userInfo.username) {
        res.status(403);
        res.send("access denied to upload file");
      }

      //getting file
      const userFile = this.userInfo.username;
      req.pipe(req.busboy);


      req.busboy.on(
        "file",
        function (fieldName: string, File: any, { filename }: any) {
          console.log("Uploading: " + filename);

          //Path where image will be uploaded
          const fstream = fs.createWriteStream(
            join(__dirname, "uploads", 'users', userInfo.username, filename)
          );
          console.log(filename);
          console.log('filename type ======>  ' + typeof (filename))
          File.pipe(fstream);
          fstream.on("close", function () {
            console.log("Upload Finished of " + filename);
            res.status(200);
            res.send("file uploaded successfully");
          });
        }
      );
    });


    //CDN part
    this.app.get('/profile_image/:username/:filename', (req: any, res: any) => {
      const username = req.param('username');
      const filename = req.param("filename");
      const path = join(__dirname, "uploads", 'users', username, filename);
      if (!existsSync(path)) {
        res.status(404);
        res.send("file not exist");
      }
      res.sendFile(path);
    });

    this.app.use(
      "/graphql",
      graphqlHTTP({
        schema: graphqlSchema,
        graphiql: true,
      })
    );

    this.app.use("", (req: any, res: any) => {
      res.send("route not found...");
    });
  };

  public listen = async () => {
    await this.server.listen(this.portNumber, () => {
      console.log(`listening on ${this.portNumber}`);
    });
  };

  public route = (route: string, action: Function) => {
    this.server.app.use(route, (req: any, res: any) => {
      action(req, res);
    });
  };
}

export default server;

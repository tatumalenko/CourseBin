import * as bodyParser from "body-parser";
import * as express from "express";
import * as passport from "passport";
import "reflect-metadata";
import { useExpressServer } from "routing-controllers";
import { Connection, createConnection } from "typeorm";

import config from "./config/config";
import UserController from "./controllers/UserController";
import AuthService from "./services/AuthService";

new class Server {
  public async run() {
    try {
      // Start the TypeORM connection
      await createConnection();
    } catch (e) {
      console.log("TypeORM connection error: ", e);
    }

    try {
      // Create the Express app
      const app = express();

      // Load the various middleware
      app.use(bodyParser.json());
      app.use(passport.initialize());

      // Create an authentication service object
      const authService = await new AuthService();

      // Load passport Strategy object middleware for use with
      // @UseBefore(passport.authenticate("jwt", { session: false })) decorator
      passport.use(await authService.jwtStrategy());

      useExpressServer(app, {
        // Load authorizationChecker function for use with @Authorization() decorator
        authorizationChecker: authService.authorizationCheckerHandler(),
        // Load the various API Controllers
        controllers: [UserController],
        // Activate the Entity validation decorators
        validation: true,
      });

      // Start up the express http server
      app.listen(config.server.port);

      console.log(`Express server is running on port ${config.server.port}`);
    } catch (e) {
      console.log("An error occured while launching the server: ", e);
    }
  }
}().run();

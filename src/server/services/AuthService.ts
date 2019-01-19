import * as jwt from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Action } from "routing-controllers";
import { getManager, Repository } from "typeorm";
import config from "../config/config";
import User from "../entities/User";

export default class AuthService {
  public userRepository: Repository<User> = getManager().getRepository(User);

  public authorizationCheckerHandler() {
    return async (action: Action, roles?: string[]) => {
      console.log(action);
      const token = action.request.headers.authorization;
      const decoded = await jwt.verify(token, config.jsonwebtoken.encryption, {
        expiresIn: config.jsonwebtoken.expiration,
      });

      const result = await this.userRepository.find({ email: decoded.email });
      return result ? true : false;
    };
  }

  public async jwtStrategy() {
    return new Strategy(
      {
        jsonWebTokenOptions: { expiresIn: config.jsonwebtoken.expiration },
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.jsonwebtoken.encryption,
      },
      async (jwtPayload, done) => {
        console.log(jwtPayload);

        const user = await this.userRepository.find({
          email: jwtPayload.email,
        });

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      },
    );
  }
}

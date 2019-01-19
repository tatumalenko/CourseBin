import { validate } from "class-validator";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import { getManager, Repository } from "typeorm";
import config from "../config/config";
import User from "../entities/User";

import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";

@JsonController()
export default class UserController {
  public userRepository: Repository<User> = getManager().getRepository(User);

  @UseBefore(passport.authenticate("jwt", { session: false }))
  @Get("/users")
  public async getAll(@Req() request: Request, @Res() response: Response) {
    try {
      const users = await this.userRepository.find();
      return response.json({
        data: users,
        method: "GET",
        status: "200",
      });
    } catch (e) {
      return response.json({
        data: e,
        method: "GET",
        status: "404",
      });
    }
  }

  @UseBefore(passport.authenticate("jwt", { session: false }))
  @Get("/users/:email")
  public async getOneByEmail(
    @Param("email") email: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const result = await this.userRepository.find({ email });
      return response.json({
        method: "POST",
        status: "200",
        user: result,
      });
    } catch (e) {
      return response.json({
        data: e,
        method: "POST",
        status: "404",
      });
    }
  }

  @Post("/users")
  public async create(
    @Body({ validate: true }) user: User,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const result = await this.userRepository.save(user);

      const token = await jwt.sign(
        { email: result.email },
        config.jsonwebtoken.encryption,
        { expiresIn: config.jsonwebtoken.expiration },
      );

      return response.json({
        data: result,
        method: "POST",
        status: "200",
        token,
      });
    } catch (e) {
      return response.json({
        data: e,
        method: "POST",
        status: "404",
      });
    }
  }
}

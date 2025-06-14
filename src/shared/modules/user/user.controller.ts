import { Config } from 'convict';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { HttpMethod } from '../../libs/rest/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { Request, Response } from 'express';
import { UserRdo } from './rdo/user.rdo.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { BaseController } from '../../libs/rest/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UploadFileMiddleware } from '../../libs/rest/middleware/upload-file.middleware.js';
import { AuthService } from '../auth/index.js';
import { LoginUserRequest } from './request/login-user-request.type.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { AuthorizedUserRdo } from './rdo/authorized-user.rdo.js';
import { LogoutUserRequest } from './request/logout-user-request.type.js';
import { LogoutUserDto } from './dto/logout-user.dto.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(LogoutUserDto),
      ],
    });
    this.addRoute({
      path: '/check-auth',
      method: HttpMethod.Get,
      handler: this.checkAuth,
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create({ body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);
    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(AuthorizedUserRdo, { email: user.email, token });
    this.ok(res, responseData);
  }

  public async logout({ body }: LogoutUserRequest, res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with email '${body.email}' not found`, 'UserController');
    }

    const token = await this.authService.logout(body);
    this.ok(res, fillDTO(AuthorizedUserRdo, { email: body.email, token }));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, { filepath: req.file?.path });
  }

  public async checkAuth({ tokenPayload: { email }}: Request, res: Response) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with email '${email}' not found`, 'UserController');
    }

    this.ok(res, fillDTO(AuthorizedUserRdo, user));
  }
}

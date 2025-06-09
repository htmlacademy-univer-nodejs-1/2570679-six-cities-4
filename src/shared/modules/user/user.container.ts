import { Container } from 'inversify';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './index.js';
import { types } from '@typegoose/typegoose';
import { BaseController } from '../../libs/rest/index.js';
import { UserController } from './user.controller.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<BaseController>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
}

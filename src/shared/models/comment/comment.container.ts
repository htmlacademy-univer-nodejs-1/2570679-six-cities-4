import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { Component } from '../../types/component.enum.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentService } from './comment-service.interface.js';


export function createCommentContainer() {
  const container = new Container();
  container.bind<CommentService>(Component.CommentServiceInterface).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return container;
}

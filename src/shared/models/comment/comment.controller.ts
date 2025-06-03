import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '../../libs/rest/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/common.js';
import { HttpMethod } from '../../libs/rest/index.js';
import { CommentService } from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { CommentRdo } from './comment.rdo.js';
import { OfferIdParam } from '../../types/offer-id-param.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentDto),
      ],
    });
  }

  public async index(
    { params }: Request<OfferIdParam>,
    res: Response,
  ): Promise<void> {
    const result = await this.commentService.findByOfferId(params.offerId);

    this.ok(res, fillDTO(CommentRdo, result ? result : []));
  }

  public async create(
    { body }: Request<unknown, unknown, CreateCommentDto>,
    res: Response,
  ): Promise<void> {
    const existsOffer = await this.offerService.findById(body.offerId);

    if (! existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id '${body.offerId}' does not exist.`,
        'CommentController'
      );
    }

    const result = await this.commentService.create({ ...body });
    this.created(res, fillDTO(CommentRdo, result));
  }
}

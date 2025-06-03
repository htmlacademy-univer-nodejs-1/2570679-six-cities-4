import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import { HttpMethod } from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/common.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferIdParam } from '../../types/offer-id-param.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferService } from './offer-service.interface.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { BaseController } from '../../libs/rest/index.js';
import { OfferRdo } from './offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { HttpError } from '../../libs/rest/index.js';
import { CommentRdo } from '../comment/comment.rdo.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';


@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offersService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController..');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto),
        new ValidateObjectIdMiddleware('offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
      ],
    });
    this.addRoute({
      path: '/index',
      method: HttpMethod.Get,
      handler: this.index,
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offersService.find();
    const offersToRes = fillDTO(OfferRdo, offers);
    this.ok(res, offersToRes);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {
    const result = await this.offersService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async delete({ params }: Request<OfferIdParam>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offersService.deleteById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({ body, params }: Request<OfferIdParam, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offersService.updateById(params.offerId, body);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async show({ params }: Request<OfferIdParam>, res: Response): Promise<void>{
    const { offerId } = params;
    const offer = await this.offersService.findById(offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async getComments({ params }: Request<OfferIdParam>, res: Response): Promise<void> {
    if (!await this.offersService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}

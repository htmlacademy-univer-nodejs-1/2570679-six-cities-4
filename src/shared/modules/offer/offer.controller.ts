import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import { HttpMethod } from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferIdParam } from '../../types/offer-id-param.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferService } from './offer-service.interface.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { BaseController } from '../../libs/rest/index.js';
import { OfferDetailsRdo } from './rdo/offer-details.rdo.js';
import { OfferDto } from './dto/offer.dto.js';
import { HttpError } from '../../libs/rest/index.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { UserService } from '../user/user-service.interface.js';
import { CityName } from '../../types/city-name.enum.js';
import { OfferRdo } from './rdo/offer.rdo.js';


@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offersService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController..');

    this.addRoute({
      path: '/index',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOfferDetails,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Post,
      handler: this.addOfferToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOfferFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffersForCity,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(OfferDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.updateOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(OfferDto),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ],
    });
  }

  public async getOffers(_req: Request, res: Response
  ): Promise<void> {
    const offers = await this.offersService.find();
    const offersToReturn = fillDTO(OfferRdo, offers);
    this.ok(res, offersToReturn);
  }

  public async createOffer({ body, tokenPayload }: Request<unknown, unknown, OfferDto>, res: Response,
  ): Promise<void> {
    const result = await this.offersService.create({ ...body, userId: tokenPayload.id });
    this.created(res, fillDTO(OfferDetailsRdo, result));
  }

  public async deleteOffer({ params }: Request<OfferIdParam>, res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offerToDelete = await this.offersService.findById(params.offerId);
    if (!offerToDelete) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'OfferController');
    }

    await this.commentService.deleteByOfferId(offerId);
    const deletedOffer = await this.offersService.deleteById(offerId);
    this.ok(res, fillDTO(OfferDetailsRdo, deletedOffer));
  }

  public async updateOffer({ body, params }: Request<OfferIdParam, unknown, OfferDto>, res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offerToUpdate = await this.offersService.findById(params.offerId);
    if (!offerToUpdate) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'OfferController');
    }

    const updatedOffer = await this.offersService.updateById(offerId, body);
    this.ok(res, fillDTO(OfferDetailsRdo, updatedOffer));
  }

  public async getOfferDetails({ params }: Request<OfferIdParam>, res: Response
  ): Promise<void>{
    const { offerId } = params;
    const offer = await this.offersService.findById(offerId);
    this.ok(res, fillDTO(OfferDetailsRdo, offer));
  }

  public async getPremiumOffersForCity({ params }: Request, res: Response
  ): Promise<void> {
    const { cityName, count } = params;
    if (!cityName || !(cityName as string in CityName)) {
      throw new HttpError(StatusCodes.NOT_FOUND, `City "${cityName}" not found`, 'OfferController');
    }

    const offersForCity = await this.offersService.getPremiumOffers(
      cityName as CityName,
      count ? Number.parseInt(count as string, 10) : null);

    this.ok(res, fillDTO(OfferRdo, offersForCity));
  }

  public async addOfferToFavorites({ params , tokenPayload }: Request<OfferIdParam>, res: Response
  ): Promise<void> {
    const user = await this.userService.findById(tokenPayload.id);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with id ${tokenPayload.id} not found`,'OfferController');
    }

    const offer = await this.offersService.addFavoriteOffer(tokenPayload.id, params.offerId);
    this.created(res, fillDTO(OfferDetailsRdo, offer));
  }

  public async deleteOfferFromFavorites({ params, tokenPayload }: Request<OfferIdParam>, res: Response
  ): Promise<void> {
    const user = await this.userService.findById(tokenPayload.id);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with id ${tokenPayload.id} not found`, 'OfferController');
    }

    const deletedOffer = await this.offersService.deleteOfferFromFavorites(tokenPayload.id, params.offerId);
    this.ok(res, fillDTO(OfferDetailsRdo, deletedOffer));
  }

  public async getFavoriteOffers({ tokenPayload }: Request, res: Response
  ): Promise<void> {
    const user = this.userService.findById(tokenPayload.id);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with id ${tokenPayload.id} not found`, 'OfferController');
    }

    const favoriteOffers = await this.offersService.getFavoriteOffers(tokenPayload.id);
    this.ok(res, fillDTO(OfferRdo, favoriteOffers));
  }
}

import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { OfferDto } from './dto/offer.dto.js';
import { CityName } from '../../types/city-name.enum.js';
import { getCoordinates } from '../../helpers/get-coordinates.js';
import { MAX_PREMIUM_OFFERS_COUNT_PER_REQUEST, DEFAULT_OFFERS_COUNT_PER_REQUEST } from './offer.const.js';
import { SortingType } from '../../types/sorting-type.enum.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async getPremiumOffers(cityName: CityName, count: number | null): Promise<DocumentType<OfferEntity>[]> {
    const entryCount = count ?? MAX_PREMIUM_OFFERS_COUNT_PER_REQUEST;
    return await this.offerModel
      .find({ isPremium: true, cityName: cityName })
      .limit(entryCount)
      .sort({ createdAt: SortingType.Down })
      .populate('userId')
      .exec();
  }

  public async addFavoriteOffer(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(offerId, { $addToSet: { favoriteUserIds: userId } }).exec();
  }

  public async deleteOfferFromFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(offerId, { $pull: { favoriteUserIds: userId } }).exec();
  }

  public async getFavoriteOffers(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .find({ favoriteUserIds: userId })
      .populate('userId')
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limitCount = count ?? DEFAULT_OFFERS_COUNT_PER_REQUEST;
    return this.offerModel
      .find()
      .sort({ createdAt: SortingType.Down })
      .limit(limitCount)
      .exec();
  }

  public async create(dto: OfferDto): Promise<DocumentType<OfferEntity>> {
    const coords = getCoordinates(dto.cityName);
    const offerToCreate = {
      ...dto,
      cityCoordinates: coords,
      rating: 1,
      commentsCount: 0,
      favoriteUserIds: [],
      postDate: new Date()
    };

    const result = await this.offerModel.create(offerToCreate);
    this.logger.info(`New offer created: ${dto.title}`);
    await result.populate('userId');
    return result;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: offerId})) !== null;
  }

  public async updateById(offerId: string, dto: OfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async incrementCommentsCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentsCount: 1,
        }
      }).exec();
  }
}

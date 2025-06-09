import { OfferDto } from './dto/offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CityName } from '../../types/city-name.enum.js';

export interface OfferService {
  create(dto: OfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: OfferDto): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  incrementCommentsCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getPremiumOffers(cityName: CityName, maxEntryCount: number | null): Promise<DocumentType<OfferEntity>[]>;
  addFavoriteOffer(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteOfferFromFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getFavoriteOffers(userId: string): Promise<DocumentType<OfferEntity>[]>;
}

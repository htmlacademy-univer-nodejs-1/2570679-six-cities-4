import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { HousingType } from '../../types/housing-type.enum.js';
import { User } from '../../types/index.js';
import { Coordinates } from '../../types/coordinates.type.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({trim: true})
  public description!: string;

  @prop()
  public previewImage!: string;

  @prop()
    isPremium!: boolean;

  @prop()
    isFavorite!: boolean;

  @prop()
    housingType!: HousingType;

  @prop()
    rating!: number;

  @prop()
    roomsCount!: number;

  @prop()
    guestsCount!: number;

  @prop()
    rentalCost!: number;

  @prop()
    owner!: User;

  @prop()
    commentsCount!: number;

  @prop()
    coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);

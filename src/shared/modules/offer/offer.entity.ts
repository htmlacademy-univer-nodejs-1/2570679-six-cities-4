import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { HousingType } from '../../types/housing-type.enum.js';
import { Coordinates } from '../../types/coordinates.type.js';
import { CityName } from '../../types/city-name.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { Amenity } from '../../types/amenity.enum.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, minlength: 10, maxlength: 100 })
  public title!: string;

  @prop({ trim: true, required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({ required: true })
  public previewImage!: string;

  @prop({
    required: true,
    validate: (arr: string[]) => arr.length === 6,
    default: [],
    _id: false
  })
  public images!: string[];

  @prop({ required: true, type: () => String, enum: CityName })
  public cityName!: CityName;

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true, type: () => String, enum: HousingType })
  public housingType!: HousingType;

  @prop({
    type: () => [String],
    enum: Amenity,
    required: true,
    default: [],
    _id: false
  })
  public amenities!: Amenity[];

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, min: 1, max: 8 })
  public roomsCount!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guestsCount!: number;

  @prop({ required: true, min: 100, max: 100_000 })
  public rentalCost!: number;

  @prop({ ref: UserEntity, required: true })
  public userId!: Ref<UserEntity>;

  @prop({ required: true })
  public commentsCount!: number;

  @prop({ required: true })
  public cityCoordinates!: Coordinates;

  @prop({ required: true })
  public favoriteUserIds!: string[];
}

export const OfferModel = getModelForClass(OfferEntity);

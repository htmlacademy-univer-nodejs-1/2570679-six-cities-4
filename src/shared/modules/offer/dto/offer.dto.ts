import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { RentOfferValidationMessage as OfferValidationMessage } from './offer.messages.js';
import { CityName } from '../../../types/city-name.enum.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { Amenity } from '../../../types/amenity.enum.js';

export class OfferDto {
  @MinLength(10, { message: OfferValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(20, { message: OfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: OfferValidationMessage.description.maxLength })
  public description!: string;

  @IsEnum(CityName, { message: OfferValidationMessage.cityName.invalidFormat })
  public cityName!: CityName;

  @IsDateString({}, { message: OfferValidationMessage.postDate.invalidFormat })
  public postDate!: Date;

  @IsString({ message: OfferValidationMessage.previewImage.invalidFormat })
  public previewImage!: string;

  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: OfferValidationMessage.images.minLength })
  @ArrayMaxSize(6, { message: OfferValidationMessage.images.maxLength })
  @IsString({ each: true, message: OfferValidationMessage.images.invalidContent })
  public images!: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsEnum(HousingType, { message: OfferValidationMessage.housingType.invalidFormat })
  public housingType!: HousingType;

  @IsInt({ message: OfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: OfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: OfferValidationMessage.roomsCount.maxValue })
  public roomsCount!: number;

  @IsInt({ message: OfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: OfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: OfferValidationMessage.guestsCount.maxValue })
  public guestsCount!: number;

  @IsInt({ message: OfferValidationMessage.rentalCost.invalidFormat })
  @Min(100, { message: OfferValidationMessage.rentalCost.minValue })
  @Max(100_000, { message: OfferValidationMessage.rentalCost.maxValue })
  public rentalCost!: number;

  @IsArray({ message: OfferValidationMessage.amenities.invalidFormat })
  @IsEnum(Amenity, { each: true, message: OfferValidationMessage.amenities.invalidContent })
  public amenities!: Amenity[];

  public userId!: string;
}

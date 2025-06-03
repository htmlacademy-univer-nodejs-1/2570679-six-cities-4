import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { RentOfferValidationMessage } from './offer.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: RentOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: RentOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(20, { message: RentOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: RentOfferValidationMessage.description.maxLength })
  public description!: string;

  @IsString()
  public city!: string;

  @IsDateString({}, { message: RentOfferValidationMessage.postDate.invalidFormat })
  public postDate!: Date;

  @IsString({ message: RentOfferValidationMessage.previewImage.invalidFormat })
  public previewImage!: string;

  @IsArray({ message: RentOfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: RentOfferValidationMessage.images.minLength })
  @ArrayMaxSize(6, { message: RentOfferValidationMessage.images.maxLength })
  @IsString({ each: true, message: RentOfferValidationMessage.images.invalidContent })
  public images!: string[];

  @IsBoolean({ message: RentOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsString()
  public housingType!: string;

  @IsInt({ message: RentOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: RentOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: RentOfferValidationMessage.roomsCount.maxValue })
  public roomsCount!: number;

  @IsInt({ message: RentOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: RentOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: RentOfferValidationMessage.guestsCount.maxValue })
  public guestsCount!: number;

  @IsInt({ message: RentOfferValidationMessage.rentalCost.invalidFormat })
  @Min(100, { message: RentOfferValidationMessage.rentalCost.minValue })
  @Max(100_000, { message: RentOfferValidationMessage.rentalCost.maxValue })
  public rentalCost!: number;

  @IsArray({ message: RentOfferValidationMessage.amenities.invalidFormat })
  @IsString({ each: true })
  public amenities!: string[];

  @IsMongoId({ message: RentOfferValidationMessage.ownerId.invalidId })
  public ownerId!: string;
}

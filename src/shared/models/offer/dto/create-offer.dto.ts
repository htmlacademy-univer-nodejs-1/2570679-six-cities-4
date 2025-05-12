export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: string;
  public postDate!: Date;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public housingType!: string;
  public rating!: number;
  public roomsCount!: number;
  public guestsCount!: number;
  public rentalCost!: number;
  public amenities!: string[];
  public ownerId!: string;
  public commentsCount!: number;
}

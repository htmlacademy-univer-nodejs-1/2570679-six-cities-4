import { Expose, Type } from 'class-transformer';
import { Amenity } from '../../../types/amenity.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { CityName } from '../../../types/city-name.enum.js';

export class OfferDetailsRdo {
    @Expose()
  public title!: string;

    @Expose()
    public description!: string;

    @Expose({ name: 'createdAt' })
    public postDate!: Date;

    @Expose()
    public cityName!: CityName;

    @Expose()
    public previewImage!: string;

    @Expose()
    public images!: string[];

    @Expose()
    public isPremium!: boolean;

    @Expose()
    public isFavorite!: boolean;

    @Expose()
    public rating!: number;

    @Expose()
    public housingType: string;

    @Expose()
    public roomsCount!: number;

    @Expose()
    public guestsCount!: number;

    @Expose()
    public commentsCount: number;

    @Expose()
    public rentalCost!: number;

    @Expose()
    public amenities!: Amenity[];

    @Expose()
    @Type(() => UserRdo)
    public user: UserRdo;

    @Expose()
    public cityCoordinates!: Coordinates;
}

import { Expose } from 'class-transformer';
import { City } from '../../types/city.type.js';
import { Amenity } from '../../types/offer.type.js';
import { Coordinates } from '../../types/coordinates.type.js';
import { User } from '../../types/user.type.js';

export class OfferRdo {
    @Expose()
    public title!: string;

    @Expose()
    public description!: string;

    @Expose()
    public postDate!: Date;

    @Expose()
    public city!: City;

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
    public roomsCount!: number;

    @Expose()
    public guestsCount!: number;

    @Expose()
    public rentalCost!: number;

    @Expose()
    public amenities!: Amenity[];

    @Expose()
    public author!: User;

    @Expose()
    public coordinates!: Coordinates;
}
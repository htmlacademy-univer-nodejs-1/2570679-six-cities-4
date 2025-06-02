import { City } from '../../../types/city.type.js';
import { User } from '../../../types/user.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { Amenity } from '../../../types/offer.type.js';

export default class UpdateOfferDto {
  title?: string;
  description?: string;
  postDate?: Date;
  city?: City;
  previewImage?: string;
  images?: string[];
  isPremium!: boolean;
  isFavorite?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  roomsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  guestsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  rentalCost?: number;
  amenities?: Amenity[];
  author?: User;
  commentsCount?: number;
  coordinates?: Coordinates;
}

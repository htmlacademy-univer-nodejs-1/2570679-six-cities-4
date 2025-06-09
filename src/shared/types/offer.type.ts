import { User } from './user.type.js';
import { HousingType } from './housing-type.enum.js';
import { City } from './city.type.js';
import { Coordinates } from './coordinates.type.js';
import { Amenity } from './amenity.enum.js';

export type RentalOffer = {
  title: string;
  description: string;
  city: City;
  postDate: Date;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  housingType: HousingType;
  rating: number;
  roomsCount: number;
  guestsCount: number;
  rentalCost: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  coordinates: Coordinates
}

export { Amenity };


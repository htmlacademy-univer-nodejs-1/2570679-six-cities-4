import { Cities } from '../../mocks/cities.js';
import { HousingType } from '../types/housing-type.enum.js';
import { Amenity, RentalOffer } from '../types/offer.type.js';
import { UserType } from '../types/user-type.enum.js';
import { parseBoolean } from './common.js';

export function createOffer(offerData : string) : RentalOffer {
  function findOrThrow<T>(array: T[], predicate: (item: T) => boolean, errorMessage: string): T {
    const result = array.find(predicate);
    if (result === undefined) {
      throw new Error(errorMessage);
    }
    return result;
  }

  const [
    title,
    description,
    cityName,
    createdDate,
    previewImageUrl,
    imagesUrls,
    isFavorite,
    isPremium,
    housingType,
    rating,
    roomsCount,
    guestsCount,
    rentalCost,
    amenitiesString,
    ownerInfo,
    commentsCount,
    coordinates] = offerData.split('\t');

  return {
    title,
    description,
    city: findOrThrow(Cities, (city) => city.name === cityName, 'Unknown city!'),
    postDate: new Date(createdDate),
    previewImage: previewImageUrl,
    images: imagesUrls.split(';'),
    isFavorite: parseBoolean(isFavorite),
    isPremium: parseBoolean(isPremium),
    housingType: housingType as HousingType,
    rating: Number.parseInt(rating, 10),
    roomsCount: Number.parseInt(roomsCount, 10),
    guestsCount: Number.parseInt(guestsCount, 10),
    rentalCost: Number.parseInt(rentalCost, 10),
    amenities: amenitiesString.split(';') as Amenity[],
    author: (() => {
      const [name, email, avatarPath, userType] = ownerInfo.split(';');
      return { name, email, avatarPath, userType: userType as UserType, password: '' };
    })(),
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: (() => {
      const [latitude, longitude] = coordinates.split(';');
      return { latitude: Number.parseInt(latitude, 10), longitude: Number.parseInt(longitude, 10) };
    })()
  };
}

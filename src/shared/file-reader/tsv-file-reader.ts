import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Cities } from '../../mocks/cities.js';
import { HousingType } from '../types/housing-type.enum.js';
import { Amenity, RentalOffer } from '../types/offer.type.js';
import { UserType } from '../types/user-type.enum.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toOffersArray(): RentalOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    const parseBoolean = (str: string): boolean => {
      if (str === 'true') {
        return true;
      }
      if (str === 'false') {
        return false;
      }
      throw new Error(`Invalid boolean string: ${str}`);
    };

    function findOrThrow<T>(array: T[], predicate: (item: T) => boolean, errorMessage: string): T {
      const result = array.find(predicate);
      if (result === undefined) {
        throw new Error(errorMessage);
      }
      return result;
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([
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
        coordinates]) => ({
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
        owner: (() => {
          const [name, email, avatarPath, userType] = ownerInfo.split(';');
          return { name, email, avatarPath, userType: userType as UserType };
        })(),
        commentsCount: Number.parseInt(commentsCount, 10),
        coordinates: (() => {
          const [latitude, longitude] = coordinates.split(';');
          return { latitude: Number.parseInt(latitude, 10), longitude: Number.parseInt(longitude, 10) };
        })()
      }));
  }
}

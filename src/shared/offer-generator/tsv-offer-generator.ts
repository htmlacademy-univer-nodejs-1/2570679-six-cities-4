import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../types/mock-server-data.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../helpers/common.js';
import { City } from '../types/city.type.js';
import { Cities } from '../../mocks/cities.js';

const MIN_PRICE = 20;
const MAX_PRICE = 200;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const randomCity: City = getRandomItem<City>(Cities);
    const cityName = randomCity.name;
    const coordinates = randomCity.coordinates;
    const coordinatesString = [coordinates.latitude.toString(), coordinates.longitude.toString()].join(';');
    const isPremium: boolean = getRandomItem<boolean>([false, true]);
    const housingType = getRandomItem<string>(this.mockData.housingTypes);
    const rating = generateRandomValue(0, 5).toString();
    const roomsCount = generateRandomValue(0, 5).toString();
    const guestsCount = generateRandomValue(1, 12).toString();
    const rentalCost = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');
    const ownerInfo =
    [
      getRandomItem<string>(this.mockData.userNames),
      getRandomItem<string>(this.mockData.emails),
      getRandomItem<string>(this.mockData.avatars),
      getRandomItem<string>(this.mockData.userTypes)
    ].join(';');
    const commentsCount = generateRandomValue(0, 50).toString();
    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      cityName,
      postDate,
      previewImage,
      images,
      false,
      isPremium,
      housingType,
      rating,
      roomsCount,
      guestsCount,
      rentalCost,
      amenities,
      ownerInfo,
      commentsCount,
      coordinatesString
    ].join('\t');
  }
}

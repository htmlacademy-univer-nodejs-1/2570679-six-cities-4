export const RentOfferValidationMessage = {
  title: {
    minLength: 'Min length is 10',
    maxLength: 'Max length is 100',
  },
  description: {
    minLength: 'Min length is 20',
    maxLength: 'Max length is 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be valid ISO date',
  },
  housingType: {
    invalidFormat: 'housingType must be valid HousingType enum value',
  },
  previewImage: {
    invalidFormat: 'preview must be valid format',
  },
  images: {
    invalidFormat: 'photos must be of array type',
    minLength: 'array length must be equal to 6',
    maxLength: 'array length must be equal to 6',
    invalidContent: 'array must contain only string values'
  },
  cityName: {
    invalidFormat: 'Provided city is not supported by the service'
  },
  isPremium: {
    invalidFormat: 'isPremium must be of boolean type',
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be of integer type',
    minValue: 'min value is 1',
    maxValue: 'max value is 8',
  },
  guestsCount: {
    invalidFormat: 'visitorsCount must be of integer type',
    minValue: 'min value is 1',
    maxValue: 'max value is 10',
  },
  rentalCost: {
    invalidFormat: 'rentCost must be of integer type',
    minValue: 'min value is 100',
    maxValue: 'max value is 100000',
  },
  amenities: {
    invalidFormat: 'amenities must be of array type',
    invalidContent: 'array must contain only Amenity enum values'
  },
  ownerId: {
    invalidFormat: 'userId is required',
    invalidId: 'userId field must be a valid id',
  },
} as const;

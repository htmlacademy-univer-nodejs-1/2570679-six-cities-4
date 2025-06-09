export const CommentValidationMessages = {
  offerId: {
    invalidFormat: 'Invalid id format: offerId'
  },
  userId: {
    invalidFormat: 'Invalid id format: userId'
  },
  text: {
    invalidFormat: 'Text is required',
    lengthField: 'Min length is 5, Max length is 1024'
  },
  date: {
    invalidFormat: 'Date must be a valid ISO date',
  },
  rating: {
    invalidFormat: 'Rating must be a number',
    minValue: 'Min length is 1',
    maxValue: 'Max length is 5'
  },
} as const;

import { IsDateString, IsMongoId, IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { CommentValidationMessages } from './comment.messages.js';

export default class CommentDto {
  @IsString({message: CommentValidationMessages.text.invalidFormat})
  @Length(5, 1024, {message: CommentValidationMessages.text.lengthField})
  public text!: string;

  @IsMongoId({message: CommentValidationMessages.offerId.invalidFormat})
  public offerId!: string;

  public userId!: string;

  @IsDateString({}, {message: CommentValidationMessages.date.invalidFormat})
  public postDate!: Date;

  @IsNumber({}, {message: CommentValidationMessages.rating.invalidFormat})
  @Min(1, { message: CommentValidationMessages.rating.minValue })
  @Max(5, { message: CommentValidationMessages.rating.maxValue })
  public rating!: number;
}

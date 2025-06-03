import { IsDateString, IsMongoId, IsNumber, IsString, Length } from 'class-validator';
import { CreateCommentValidationMessages } from './create-comment.messages.js';

export default class CreateCommentDto {
  @IsString({message: CreateCommentValidationMessages.text.invalidFormat})
  @Length(5, 1024, {message: CreateCommentValidationMessages.text.lengthField})
  public text!: string;

  @IsMongoId({message: CreateCommentValidationMessages.offerId.invalidFormat})
  public offerId!: string;

  public userId!: string;

  @IsDateString({}, {message: CreateCommentValidationMessages.date.invalidFormat})
  public date!: Date;

  @IsNumber({}, {message: CreateCommentValidationMessages.rating.invalidFormat})
  @Length(1, 5, {message: CreateCommentValidationMessages.rating.lengthField})
  public rating!: number;
}

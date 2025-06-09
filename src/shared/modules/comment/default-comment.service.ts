import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { CommentEntity } from './comment.entity.js';
import { Component } from '../../types/component.enum.js';
import CommentDto from './dto/comment.dto.js';
import { CommentService } from './comment-service.interface.js';
import { MAX_COMMENTS_COUNT_TO_RETURN } from './comment.const.js';
import { OfferEntity } from '../offer/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CommentDto): Promise<DocumentType<CommentEntity>> {
    const createdComment = await this.commentModel.create(dto);
    const offerComments = await this.commentModel.find({ offerId: dto.offerId }).exec();

    if (offerComments.length > 0) {
      const ratingSum = offerComments
        .map((comment) => comment.rating)
        .reduce((currSum, val) => currSum + val, 0);

      const averageRating = ratingSum / offerComments.length;
      await this.offerModel.findByIdAndUpdate(dto.offerId, { commentsCount: offerComments.length, rating: averageRating }).exec();
    }

    return createdComment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId })
      .limit(MAX_COMMENTS_COUNT_TO_RETURN)
      .sort({ createdAt: -1 })
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();
    return result.deletedCount;
  }
}

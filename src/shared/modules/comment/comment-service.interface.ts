import {DocumentType} from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import CommentDto from './dto/comment.dto.js';


export interface CommentService {
    create(dto: CommentDto): Promise<DocumentType<CommentEntity>>;
    findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
    deleteByOfferId(offerId: string): Promise<number | null>;
}

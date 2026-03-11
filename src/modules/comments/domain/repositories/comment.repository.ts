import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';
import { CountCommentDto } from '../../application/dtos/count-comment.dto';

export type CreateCommentModel = {
  content: string;
  authorId: string;
  postId: string;
};

export type UpdateCommentModel = Partial<CreateCommentModel>;

export abstract class CommentRepository {
  public abstract getComments(
    tagsArray: string[],
    user: UserEntity,
  ): CommentEntity[] | Promise<CommentEntity[]>;

  public abstract getPostComments(
    idPost: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: string,
  ) : CommentEntity[] | Promise<CommentEntity[]>;

  public abstract getCommentById(
    id: string,
  ): CommentEntity | undefined | Promise<CommentEntity | undefined>;

  public abstract getPostCommentCount(
    idPost: string,
  ): Promise<CountCommentDto>;

  public abstract createComment(input: CommentEntity): void | Promise<void>;

  public abstract updateComment(
    id: string,
    input: CommentEntity,
  ): void | Promise<void>;

  public abstract deleteComment(id: string): void | Promise<void>;


}
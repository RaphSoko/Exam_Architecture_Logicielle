import { Injectable, NotFoundException } from "@nestjs/common";
import { PostRepository } from "src/modules/posts/domain/repositories/post.repository";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { CommentEntity } from "../../domain/entities/comment.entity";
import { CommentRepository } from "../../domain/repositories/comment.repository";


@Injectable()
export class GetPostCommentUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    idPost: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: string,
  ): Promise<CommentEntity[]> {
    const post = await this.postRepository.getPostById(idPost);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const allowedSort = ['createdAt', 'updatedAt']
    const allowedOrder = ['desc', 'asc']

    const finalSortBy = allowedSort.includes(sortBy) ? sortBy : allowedSort[0]
    const finalOrder = (allowedOrder.includes(order) ? order.toUpperCase() : allowedOrder[0].toUpperCase()) as 'ASC' | 'DESC';

    return this.commentRepository.getPostComments(idPost, page, pageSize, finalSortBy, finalOrder);
  }
}
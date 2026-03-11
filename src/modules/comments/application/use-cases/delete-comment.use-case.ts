import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PostRepository } from "src/modules/posts/domain/repositories/post.repository";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { CommentRepository } from "../../domain/repositories/comment.repository";

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository, 
  ) {}

  public async execute(
    id: string,
    user: UserEntity,
  ): Promise <void> {
    const comment = await this.commentRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const post = await this.postRepository.getPostById(comment.postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const postAuthorId = post.authorId;
    if (!user.permissions.comments.canDelete(comment, postAuthorId)) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }
    await this.commentRepository.deleteComment(id);
  }
}
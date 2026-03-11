import { Injectable, NotFoundException } from "@nestjs/common";
import { PostRepository } from "src/modules/posts/domain/repositories/post.repository";
import { CommentRepository } from "../../../comments/domain/repositories/comment.repository";
import { CountCommentDto } from "../../../comments/application/dtos/count-comment.dto";

@Injectable()
export class CountCommentUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(postId: string): Promise<CountCommentDto> {
    const post = await this.postRepository.getPostById(postId)
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.commentRepository.getPostCommentCount(post.id);

  }
}
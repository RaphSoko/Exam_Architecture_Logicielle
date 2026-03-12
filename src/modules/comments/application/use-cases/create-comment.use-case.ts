import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { PostRepository } from 'src/modules/posts/domain/repositories/post.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentCreatedEvent } from '../../domain/events/comment-created.event';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
    private readonly commentService: CommentRepository,
  ) {}

  public async execute(input: CreateCommentDto, user: UserEntity, postId: string): Promise<CommentEntity> {
    const post = await this.postRepository.getPostById(postId)
    if (!post) {
      throw new NotFoundException('Post not found')
    }

    if (!user.permissions.comments.canCreate(post)) {
      throw new ForbiddenException('You do not have permission to create a comment on this post');
    }

    const comment = CommentEntity.create(input.content, user, postId);

    await this.commentService.createComment(comment);
    this.eventEmitter.emit(CommentCreatedEvent, {
      commentId: comment.id,
      postId: postId,
      authorId: user.id,
    });

    return comment
  }
}
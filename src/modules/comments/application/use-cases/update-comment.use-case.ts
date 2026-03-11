import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { CommentEntity } from "../../domain/entities/comment.entity";
import { CommentRepository } from "../../domain/repositories/comment.repository";
import { CreateCommentDto } from "../dtos/create-comment.dto";

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    id: string,
    input: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const comment = await this.commentRepository.getCommentById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (!user.permissions.comments.canUpdate(comment)) {
      throw new ForbiddenException('You do not have permission to update this comment');
    }

    comment.update(input.content)
    await this.commentRepository.updateComment(id, comment)

    return comment

  }
}
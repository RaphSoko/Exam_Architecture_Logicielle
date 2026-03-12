import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { PostDeletedEvent, PostDeletedEventPayload } from '../../domain/events/post-deleted.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string, currentUser: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(id);
    if (post){
      if (currentUser.getRole() == 'admin' || currentUser.id === post.authorId) {
        this.loggingService.log('DeletePostUseCase.execute');
        await this.postRepository.deletePost(id);
        this.eventEmitter.emit(PostDeletedEvent, {
          postId: post.id,
          postTitle: post.getTitle(),
          userId: currentUser.id
        } as PostDeletedEventPayload);
      }
    }
  }  
}

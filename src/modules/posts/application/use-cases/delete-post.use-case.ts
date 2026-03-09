import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, currentUser: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(id);
    if (post){
      if (currentUser.getRole() == 'admin' || currentUser.id === post.authorId) {
        this.loggingService.log('DeletePostUseCase.execute');
        await this.postRepository.deletePost(id);
      }
    }
  }  
}

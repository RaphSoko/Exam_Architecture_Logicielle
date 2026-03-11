import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { TagRepository } from 'src/modules/tags/domain/repositories/tag.repository';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(tagsArray: string[], user : UserEntity): Promise<PostEntity[]> {
    this.loggingService.log('GetPostsUseCase.execute');
    var tagsIds: string[] = [];
    if (tagsArray.length > 0) {
      for (const tag of tagsArray) {
        var tagId = (await this.tagRepository.getTagByName(tag))?.id;
        if (!tagId) {
          return [];
        } else {
          tagsIds.push(tagId);
        }
      }
    }
    return this.postRepository.getPosts(tagsIds, user);
  }
}

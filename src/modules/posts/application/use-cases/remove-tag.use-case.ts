import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostEntity } from '../../domain/entities/post.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { TagRepository } from 'src/modules/tags/domain/repositories/tag.repository';


@Injectable()
export class RemoveTagPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(id: string, tagId: string, user: UserEntity) {
    const post = await this.postRepository.getPostById(id);

    if (post) {
      if (!user.permissions.posts.canAddTagToPost(post)) {
        throw new Error('You do not have permission to update the tags of this post');
      }

      const tag = await this.tagRepository.getTagById(tagId);
      if (tag) {
        const alreadyLinked = post.tags.some((tag) => tag.id === tagId);
        if (!alreadyLinked) {
          throw new Error('This tag is not linked to the post');
        }

        await this.postRepository.removeTag(id, tagId);
      } else {
        throw new Error('Tag not found');
      }
    } else {
      throw new Error('Post not found');
    }
  }
}
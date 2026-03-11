import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostEntity } from '../../domain/entities/post.entity';
import { TagRepository } from 'src/modules/tags/domain/repositories/tag.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class AddTagPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(id: string, tagId: string, user: UserEntity) {
    const post = await this.postRepository.getPostById(id);

    if (post) {
      if (!user.permissions.posts.canAddTagToPost(post)) {
        throw new ForbiddenException('You do not have permission to update the tags of this post');
      }

      const tag = await this.tagRepository.getTagById(tagId);
      if (tag) {
        const alreadyLinked = post.tags.some((tag) => tag.id === tagId);
        if (alreadyLinked) {
          throw new ConflictException('This tag is already linked to the post');
        }
        await this.postRepository.addTag(id, tagId);

        return await this.postRepository.getPostById(id);
      } else {
        throw new NotFoundException('Tag not found');
      }
    } else {
      throw new NotFoundException('Post not found');
    }
  }
}
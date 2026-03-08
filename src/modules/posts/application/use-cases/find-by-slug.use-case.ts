import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(slug: string, currentUser?: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    if (post.status !== 'accepted') {
      if (!currentUser) {
        throw new ForbiddenException("You must be logged in to view this draft.");
      }

      const isAuthor = post.authorId === currentUser.id;
      const isAdmin = currentUser.getRole() === 'admin';
      if (!isAuthor && !isAdmin) {
        throw new ForbiddenException("You do not have permission to view this post.");
      }
    }

    return post;
  }
}
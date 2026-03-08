import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from "@nestjs/common";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { PostEntity } from "../../domain/entities/post.entity";
import { PostRepository } from "../../domain/repositories/post.repository";

@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  private readonly SLUG_REGEXP = /^[a-z0-9][a-z0-9-]{1,98}[a-z0-9]$/;

  async execute(id: string, newSlug: string, currentUser: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.getPostById(id);
    if (!post) throw new NotFoundException('Post does not exist');

    if (post.authorId !== currentUser.id && currentUser.getRole() !== 'admin') {
      throw new ForbiddenException("You are not the author of this post or an admin");
    }

    if (!this.SLUG_REGEXP.test(newSlug)) {
      throw new BadRequestException('Invalid slug format');
    }

    const existing = await this.postRepository.findBySlug(newSlug);
    if (existing && existing.id !== id) {
      throw new ConflictException('Slug already used');
    }

    post.updateSlug(newSlug);
    await this.postRepository.updatePost(id, post);

    return post;
  }
}
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { PostEntity } from "../../domain/entities/post.entity";
import { PostRepository } from "../../domain/repositories/post.repository";

@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  private readonly SLUG_REGEXP = /^[a-z0-9][a-z0-9-]{1,98}[a-z0-9]$/;

  async execute(id: string, newSlug: string, currentUser: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.getPostById(id);
    if (!post) throw new NotFoundException('Post introuvable');

    if (post.authorId !== currentUser.id && currentUser.getRole() !== 'admin') {
      throw new ForbiddenException("Action non autorisée");
    }

    if (!this.SLUG_REGEXP.test(newSlug)) {
      throw new BadRequestException('Le format du slug est invalide');
    }

    const existing = await this.postRepository.findBySlug(newSlug);
    if (existing && existing.id !== id) {
      throw new BadRequestException('Ce slug est déjà utilisé par un autre article');
    }

    post.updateSlug(newSlug);
    await this.postRepository.updatePost(id, post);

    return post;
  }
}
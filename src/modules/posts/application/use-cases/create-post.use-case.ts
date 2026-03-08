import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InvalidSlugException } from '../../domain/exceptions/invalid-slug.exception';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
  ) {}

  private readonly SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,98}[a-z0-9]$/;

  public async execute(input: CreatePostDto, user: UserEntity): Promise<void> {
    if (!user.permissions.posts.canCreate()) {
      throw new UserCannotCreatePostException();
    }

    let baseSlug: string;
    if(input.slug) {
      if (!this.SLUG_REGEX.test(input.slug)) {
        throw new InvalidSlugException();
      }
      baseSlug = input.slug;
    } else {
      baseSlug = this.formatSlug(input.title);
    }
    
    const uniqueSlug = await this.generateUniqueSlug(baseSlug);
    const post = PostEntity.create(input.title, input.content, input.authorId, uniqueSlug);

    await this.postRepository.createPost(post);

    this.eventEmitter.emit(PostCreatedEvent, {
      postId: post.id,
      authorId: input.authorId,
    });
  }

  private formatSlug(text: string): string {
    let slug = text
      .toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-z0-9]/g, '-') 
      .replace(/-+/g, '-') 
      .replace(/^-|-$/g, '');
    if (!slug || slug === '') {
        return `post-${Math.random().toString(36).substring(2, 7)}`;
    }
    return slug.substring(0, 100); 
  }
  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let uniqueSlug = baseSlug;
    let counter = 2;

    while (await this.postRepository.findBySlug(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    return uniqueSlug;
  }
}

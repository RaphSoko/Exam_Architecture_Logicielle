import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TagDeletedEvent } from '../../domain/events/tag-deleted.event';

@Injectable()
export class DeleteTagsUseCase {
  constructor(private readonly tagRepository: TagRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    if (!user.permissions.tags.canDelete()) {
      throw new ForbiddenException('You do not have permission to delete a tag');
    }

    const tag = await this.tagRepository.getTagById(id);
    if (tag) {
      await this.tagRepository.deleteTag(id);

      this.eventEmitter.emit(TagDeletedEvent, {
        tagId: tag.id,
      });
    } else {
      throw new NotFoundException('Tag not found');
    }
  }
}
import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UpdateTagDto } from '../dtos/update-tag.dto';
import { TagEntity } from '../../domain/entities/tag.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { TagName } from '../../domain/value-objects/tag-name.value-object';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TagUpdatedEvent } from '../../domain/events/tag-updated.event';

@Injectable()
export class UpdateTagsUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    id: string,
    input: UpdateTagDto,
    user: UserEntity,
  ): Promise<TagEntity> {

    if (!user.permissions.tags.canUpdate()) {
      throw new Error('You do not have permission to update a tag');
    }

    const duplicateTag = await this.tagRepository.getTagByName(
      new TagName(input.name).toString(),
    );

    if (duplicateTag) {
      throw new Error('A tag with the same name already exists');
    }

    const tag = await this.tagRepository.getTagById(id);

    if (tag) {
      tag.update(input.name);
      await this.tagRepository.updateTag(id, tag);

      this.eventEmitter.emit(TagUpdatedEvent, {
            tagId: tag.id,
          });

      return tag;
    } else {
      throw new Error('Tag not found');
    }
  }
}
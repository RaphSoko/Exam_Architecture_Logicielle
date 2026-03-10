import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { TagEntity } from '../../domain/entities/tag.entity';

import { TagName } from '../../domain/value-objects/tag-name.value-object';
import { TagCreatedEvent } from '../../domain/events/tag-created.event';

@Injectable()
export class CreateTagUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(input: CreateTagDto, user: UserEntity): Promise<TagEntity> {
    if (!user.permissions.tags.canCreate()) {
      throw new Error('You do not have permission to create a tag');
    }

    const duplicateTag = await this.tagRepository.getTagByName(new TagName(input.name).toString())

    if (duplicateTag) {
      throw new Error('A tag with the same name already exists');
    }

    const tag = TagEntity.create(input.name, new Date(Date.now()));

    await this.tagRepository.createTag(tag);

    this.eventEmitter.emit(TagCreatedEvent, {
      tagId: tag.id,
    });

    return tag
  }
}
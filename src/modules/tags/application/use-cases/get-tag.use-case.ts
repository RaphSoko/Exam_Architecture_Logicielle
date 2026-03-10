import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { TagEntity } from '../../domain/entities/tag.entity';

@Injectable()
export class GetTagsUseCase {
  constructor(
    private readonly tagsRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(): Promise<TagEntity[]> {
    this.loggingService.log('GetPostsUseCase.execute');
    return this.tagsRepository.getTags();
  }
}
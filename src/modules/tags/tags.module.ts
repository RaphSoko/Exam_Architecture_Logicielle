import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { TagsController } from './infrastructure/controllers/tag.controller';
import { TagRepository } from './domain/repositories/tag.repository';
import { SQLiteTagsRepository } from './infrastructure/repositories/tag.sqlite.repository';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { GetTagsUseCase } from './application/use-cases/get-tag.use-case';
import { AuthModule } from '../shared/auth/auth.module';
import { UpdateTagsUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagsUseCase } from './application/use-cases/delete-tag.use-case';

@Module({
  imports: [AuthModule, LoggingModule],
  controllers: [TagsController],
    providers: [
      {
        provide: TagRepository,
        useClass: SQLiteTagsRepository,
      },

      CreateTagUseCase,
      GetTagsUseCase,
      UpdateTagsUseCase,
      DeleteTagsUseCase,
    ],
    exports: [TagRepository]
})
export class TagsModule {}
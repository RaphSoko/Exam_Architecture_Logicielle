import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { AuthModule } from '../shared/auth/auth.module';
import { FollowRepository } from './domain/repositories/follows.repository';
import { SQLiteFollowRepository } from './infrastructure/repositories/follow.sqlite.repository';

@Module({
  imports: [AuthModule, LoggingModule],
  controllers: [],
    providers: [
      {
        provide: FollowRepository,
        useClass: SQLiteFollowRepository,
      }
    ],
    exports: [FollowRepository]
})
export class FollowModule {}
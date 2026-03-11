import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { AuthModule } from '../shared/auth/auth.module';
import { CommentRepository } from './domain/repositories/comment.repository';
import { SQLiteCommentRepository } from './infrastructure/repositories/comment.sqlite.repository';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { CommentController } from './infrastructure/controllers/comment.controller';
import { PostRepository } from '../posts/domain/repositories/post.repository';
import { SQLitePostRepository } from '../posts/infrastructure/repositories/post.sqlite.repository';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';

@Module({
  imports: [AuthModule, LoggingModule],
  controllers:[CommentController],
    providers: [
      {
        provide: CommentRepository,
        useClass: SQLiteCommentRepository,
      },
      {
        provide: PostRepository,
        useClass: SQLitePostRepository,
      },
      UpdateCommentUseCase,
      DeleteCommentUseCase,
    ],
    exports: [CommentRepository]
})
export class CommentModule {}
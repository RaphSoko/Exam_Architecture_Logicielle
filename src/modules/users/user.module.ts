import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { UserController } from './infrastructure/controllers/user.controller';
import { SQLiteUserRepository } from './infrastructure/repositories/user.sqlite.repository';
import { FollowModule } from '../follows/follow.module';
import { FollowUserUseCase } from './application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from './application/use-cases/unfollow-user.use-case';
import { GetUserFollowerUseCase } from './application/use-cases/get-user-follower.use-case';
import { GetUserFollowingUseCase } from './application/use-cases/get-user-following.use-case';

@Module({
  imports: [LoggingModule,FollowModule],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: SQLiteUserRepository,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetUserFollowerUseCase,
    GetUserFollowingUseCase
  ],
  exports: [UserRepository],
})
export class UserModule {}

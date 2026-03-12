import { Injectable, NotFoundException } from "@nestjs/common";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { FollowRepository } from "src/modules/follows/domain/repositories/follows.repository";
import { FollowEntity } from "src/modules/follows/domain/entities/follow.entity";

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, user: UserEntity) {
    this.loggingService.log('UnfollowUserUseCase.execute');
    const userToFollow = await this.userRepository.getUserById(id);
    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    const follows = await this.followRepository.getUserFollows(user.id);
    if (!follows || follows.length === 0) {
      throw new NotFoundException('You are not following any users');
    }
    const alreadyfollowing = follows.some((follow) => follow.followedId === id);
    if (!alreadyfollowing) {
      throw new NotFoundException('You are not following this user');
    }
    const follow = await this.followRepository.getFollow(user.id, id);
    await this.followRepository.unfollowUser(follow)
  }
}
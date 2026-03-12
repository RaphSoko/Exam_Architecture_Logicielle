import { Injectable, NotFoundException } from "@nestjs/common";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Not } from "typeorm";

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

    const follows = await this.followRepository.getUserFollowed(user.id);
    const alreadyfollowing = follows.some((follow) => follow.followedId === id);
    if (!alreadyfollowing) {
      throw new NotFoundException('You are not following this user');
    }
    await this.followRepository.removeUserFollowed(user.id, id)
  }
}
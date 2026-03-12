import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { not } from "joi";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { FollowUserDto } from "../dtos/follow-user.dto";

Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followService: FollowRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<FollowUserDto> {
    this.loggingService.log('UserUseCase.execute');
    const userToFollow = await this.userRepository.getUserById(id);

    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    if (!user.permissions.user.canFollow(userToFollow.id)) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const follows = await this.followService.getUserFollowed(user.id);

    const alreadyfollowing = follows.some((follow) => follow.followedId === id);
    if (alreadyfollowing) {
      throw new ConflictException('You are already following this user');
    }

    const follow = FollowEntity.create(user.id, id, new Date(Date.now()));
    await this.followService.createFollow(follow);
    let resFollow = new FollowUserDto();

    resFollow.followedAt = follow.followedAt;
    resFollow.followedId = follow.followedId;
    resFollow.followerId = follow.followerId;

    return resFollow;
  }
}
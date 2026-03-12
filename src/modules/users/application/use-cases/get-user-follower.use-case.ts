import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repository";
import { FollowRepository } from "src/modules/follows/domain/repositories/follows.repository";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { FollowDto } from "../dtos/follow.dto";
import { GetUserFollowerDto } from "../dtos/get-user-follower.dto";

@Injectable()
export class GetUserFollowerUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, page: number, pageSize: number): Promise<GetUserFollowerDto> {
    this.loggingService.log('GetUserFollowerUseCase.execute');
    const follows = await this.followRepository.getUserFollower(id, page, pageSize);

    let res = new GetUserFollowerDto()
    res.followers = []
    for(const follow of follows ) {
      let i = new FollowDto()
      const user = await this.userRepository.getUserById(follow.followerId)
      if (!user) {
        throw new NotFoundException('User not found');
      }
      i.followedAt = follow.followedAt;
      i.username = user.getUsername().toString()
      i.id = follow.id
      res.followers.push(i)
    }

    return res;

  }
}
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user.repository";
import { log } from "console";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { FollowRepository } from "src/modules/follows/domain/repositories/follows.repository";
import { FollowDto } from "../dtos/follow.dto";
import { GetUserFollowingDto } from "../dtos/get-user-following.dto";

@Injectable()
export class GetUserFollowingUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, page: number, pageSize: number): Promise<GetUserFollowingDto> {
    log('GetUserFollowingUseCase.execute');
    const follows = await this.followRepository.getUserFollowing(id, page, pageSize);

    let res = new GetUserFollowingDto()
    res.following = []
    for(const follow of follows ) {
      let i = new FollowDto()
      const user = await this.userRepository.getUserById(follow.followedId)
      if (!user) {
        throw new NotFoundException('User not found');
      }
      i.followedAt = follow.followedAt;
      i.username = user.getUsername().toString();
      i.id = follow.id
      res.following.push(i)
    }
    return res;
  }
}
import { FollowDto } from "./follow.dto";

export class GetFollowUserDto {
  followers?: FollowDto[]
  following?: FollowDto[]
  total: number;
  page: number;
  pageSize: number;
}

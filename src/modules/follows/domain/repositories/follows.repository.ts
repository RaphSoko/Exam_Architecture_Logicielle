import { FollowEntity } from '../entities/follow.entity';

export type CreateFollowModel = {
  followerId: string;
  followedId: string;
  followedAt: Date;
};

export abstract class FollowRepository {
  public abstract getUserFollowers(
    id: string,
  ): FollowEntity[] | undefined | Promise<FollowEntity[] | undefined>;

  public abstract getUserFollows(
    id: string,
  ): FollowEntity[] | undefined | Promise<FollowEntity[] | undefined>;

  public abstract followUser(input: FollowEntity): void | Promise<void>;

  public abstract unfollowUser(input: FollowEntity): void | Promise<void>;

  public abstract getFollow(idFollower: string, idFollowed: string);

  public abstract getUserFollower(
    idUser: string,
    page: number,
    pageSize: number,
  ): Promise<FollowEntity[]>;

  public abstract getUserFollowing(
    idUser: string,
    page: number,
    pageSize: number,
  ): Promise<FollowEntity[]>;
}
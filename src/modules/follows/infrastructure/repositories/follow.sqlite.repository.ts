import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class SQLiteFollowRepository implements FollowRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getFollow(idFollower: string, idFollowed: string) {
    return this.dataSource
      .getRepository(SQLiteFollowEntity)
      .findOne({ where: { followedId: idFollowed, followerId: idFollower } });
  }

  public async getUserFollowers(id: string): Promise<FollowEntity[]> {
    const data = await this.dataSource
      .getRepository(SQLiteFollowEntity)
      .find({ where: { followedId: id } });
    return data.map((follow) => FollowEntity.reconstitute({ ...follow }));
  }
  public async getUserFollows(id: string): Promise<FollowEntity[]> {
    const data = await this.dataSource
      .getRepository(SQLiteFollowEntity)
      .find({ where: { followerId: id } });
    return data.map((follow) => FollowEntity.reconstitute({ ...follow }));
  }
  public async followUser(input: FollowEntity): Promise<void> {
    this.dataSource.getRepository(SQLiteFollowEntity).save(input.toJSON());
  }

  public unfollowUser(input: FollowEntity) {
    this.dataSource.getRepository(SQLiteFollowEntity).delete(input.id);
  }

  public async getUserFollower(
    idUser: string,
    page: number,
    pageSize: number,
  ): Promise<FollowEntity[]> {
    const data = await this.dataSource.getRepository(SQLiteFollowEntity).find({
      where: { followedId: idUser },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data.map((follow) => FollowEntity.reconstitute({ ...follow }));
  }

  public async getUserFollowing(
    idUser: string,
    page: number,
    pageSize: number,
  ): Promise<FollowEntity[]> {
    const data = await this.dataSource.getRepository(SQLiteFollowEntity).find({
      where: { followerId: idUser },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data.map((follow) => FollowEntity.reconstitute({ ...follow }));
  }
}
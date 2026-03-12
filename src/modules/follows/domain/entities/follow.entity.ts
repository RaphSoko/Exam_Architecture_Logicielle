import { v4 } from 'uuid';

export class FollowEntity {
  private _followerId: string;
  private _followedId: string;
  private _followedAt: Date;

  private constructor(
    readonly id: string,
    followerId: string,
    followedId: string,
    followedAt: Date
  ) {
    this._followerId = followerId;
    this._followedId = followedId;
    this._followedAt = followedAt
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new FollowEntity(
      input.id as string,
      input.followerId as string,
      input.followedId as string,
      input.followedAt as Date,
    );
  }

  public get followerId() {
    return this._followerId
  }

  public get followedId() {
    return this._followedId
  }

  public get followedAt() {
    return this._followedAt
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      followerId: this._followerId,
      followedId: this._followedId,
      followedAt: this._followedAt.toString(),
    };
  }

  public static create(
    followerId: string,
    followedId: string,
    followedAt: Date,
  ): FollowEntity {
    return new FollowEntity(
      v4(),
      followerId,
      followedId,
      followedAt
    );
  }
}
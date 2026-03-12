export class UserPermissions {
  constructor(
    private readonly userId: string,
  ) {}

  public canFollow(followingId: string): boolean {
    return !(this.userId === followingId);
  }


}
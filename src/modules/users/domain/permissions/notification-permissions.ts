export class NotificationPermissions {
  constructor(
    private readonly userId: string,
  ) {}

  public canRead(notifId: string): boolean {
    return (this.userId === notifId);
  }
}
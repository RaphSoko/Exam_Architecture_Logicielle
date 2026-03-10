import { UserRole } from '../entities/user.entity';

export class TagsPermissions {
  constructor(
    private readonly role: UserRole,
  ) {}

  public canCreate(): boolean {
    return this.role === 'admin';
  }

  public canUpdate(): boolean {
    return this.role === 'admin';
  }

  public canDelete(): boolean {
    return this.role === 'admin';
  }

}
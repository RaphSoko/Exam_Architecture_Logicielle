import { UserRole } from '../entities/user.entity';
import { CommentPermissions } from './comment-permissions';
import { NotificationPermissions } from './notification-permissions';
import { PostPermissions } from './post-permissions';
import { TagsPermissions } from './tag-permissions';
import { UserPermissions } from './user-permissions';

export class Permissions {
  public readonly posts: PostPermissions;
  public readonly tags: TagsPermissions;
  public readonly comments: CommentPermissions;
  public readonly notification: NotificationPermissions;
  public readonly user: UserPermissions;

  constructor(userId: string, role: UserRole) {
    this.posts = new PostPermissions(userId, role);
    this.tags = new TagsPermissions(role);
    this.comments = new CommentPermissions(userId, role);
    this.notification = new NotificationPermissions(userId);
    this.user = new UserPermissions(userId);
  }
}

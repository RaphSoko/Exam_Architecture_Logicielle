import { CommentEntity } from 'src/modules/comments/domain/entities/comment.entity';
import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UserRole } from '../entities/user.entity';

export class CommentPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) {}

  public canCreate(post: PostEntity): boolean {
    return post.status === 'accepted';
  }

  public canUpdate(comment: CommentEntity) {
    return comment.author.id === this.userId;
  }

  public canDelete(comment: CommentEntity, authorId: string) {
    if (this.role === 'admin' || this.role === 'moderator') return true;
    if (authorId === this.userId) return true;
    return comment.author.id === this.userId;
  }
}
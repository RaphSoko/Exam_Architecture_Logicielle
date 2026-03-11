import { v4 } from 'uuid';
import { TagEntity } from 'src/modules/tags/domain/entities/tag.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tag.sqlite.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { CommentContent } from '../value-objects/comment-content.value-object';

export class CommentEntity {
  private _postId: string;
  private _content: CommentContent;
  private _author: UserEntity;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    readonly id: string,
    postId: string,
    content: CommentContent,
    author: UserEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._postId = postId;
    this._content = content;
    this._author = author;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public get postId() {
    return this._postId;
  }

  public get author() {
    return this._author;
  }

  public get content() {
    return this._content;
  }

  public static reconstitute(input: Record<string, unknown>) {
    var tags: TagEntity[] = [];
    if (input.tags) {
      (input.tags as SQLiteTagEntity[]).forEach((element) => {
        tags.push(TagEntity.reconstitute({ ...element }));
      });
    }

    return new CommentEntity(
      input.id as string,
      input.postId as string,
      new CommentContent(input.content as string),
      input.author as UserEntity,
      input.createdAt as Date,
      input.updatedAt as Date,
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      content: this._content.toString(),
      author: this._author,
      postId: this._postId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public static create(
    content: string,
    author: UserEntity,
    postId: string,
  ): CommentEntity {
    return new CommentEntity(
      v4(),
      postId,
      new CommentContent(content),
      author,
      new Date(Date.now()),
      new Date(Date.now()),
    );
  }

  public update(content: string) {

    if (content) {
      this._content = new CommentContent(content);
      this._updatedAt = new Date(Date.now());
    }

  }
}
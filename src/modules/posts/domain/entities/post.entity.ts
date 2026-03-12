import { v4 } from 'uuid';
import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';
import { TagEntity } from 'src/modules/tags/domain/entities/tag.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tag.sqlite.entity';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;
  private _slug: string;
  private _tags: TagEntity[];

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
    slug: string,
    tags: TagEntity[],

  ) {
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._status = status;
    this._slug = slug;
    this._tags = tags;
  }

  public get status() {
    return this._status;
  }

  public get tags(){
    return this._tags;
  }

  public get authorId() {
    return this._authorId;
  }

  public static reconstitute(input: Record<string, unknown>) {
    var tags: TagEntity[] = [];
    if (input.tags) {
      (input.tags as SQLiteTagEntity[]).forEach((element) => {
        tags.push(TagEntity.reconstitute({ ...element }));
      });
    }
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
      input.slug as string,
      tags as TagEntity[],
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
      slug: this._slug,
      tags: this._tags,
    };
  }

  public static create(
    title: string,
    content: string,
    authorId: string,
    slug: string,
  ): PostEntity {
    return new PostEntity(
      v4(),
      new PostTitle(title),
      new PostContent(content),
      authorId,
      'draft',
      slug,
      [],
    );
  }

  public update(title?: string, content?: string, status?: PostStatus){
    if (title) {
      this._title = new PostTitle(title);
    }

    if (content) {
      this._content = new PostContent(content);
    }

    if (status) {
      this._status = status;
    }
  }
  
  public updateSlug(newSlug: string) {
    this._slug = newSlug;
 }

 public getTitle(): string {
  return this._title.toString();
 }
}

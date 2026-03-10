import { TagEntity } from "../entities/tag.entity";
import { TagName } from "../value-objects/tag-name.value-object";

export type CreateTagModel = {
  name: TagName;
  createdAt: Date;
};

export type UpdateTagModel = {
  name: TagName;
};

export abstract class TagRepository {

  public abstract getTagById(
    id: string,
  ): TagEntity | undefined | Promise<TagEntity | undefined>;

  public abstract getTagByName(
    name: string,
  ): TagEntity | undefined | Promise<TagEntity | undefined>;

  public abstract getTags(): TagEntity[] | Promise<TagEntity[]>;

  public abstract createTag(input: TagEntity): void | Promise<void>;

  public abstract updateTag(
    id: string,
    input: TagEntity,
  ): void | Promise<void>;

  public abstract deleteTag(id: string): void | Promise<void>;
}
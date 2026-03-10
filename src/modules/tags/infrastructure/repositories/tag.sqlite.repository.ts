import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { SQLiteTagEntity } from '../entities/tag.sqlite.entity';


@Injectable()
export class SQLiteTagsRepository implements TagRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getTagByName(name: string): Promise<TagEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { name: name } });

    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async getTagById(id: string): Promise<TagEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { id } });

    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async getTags(): Promise<TagEntity[]> {
    const data = await this.dataSource.getRepository(SQLiteTagEntity).find();

    return data.map((tag) => TagEntity.reconstitute({ ...tag }));
  }

  public async createTag(input: TagEntity): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).save(input.toJSON());
  }

  public async updateTag(id: string, input: TagEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteTagEntity)
      .update(id, input.toJSON());
  }

  public async deleteTag(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).delete(id);
  }
}
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getPosts(tagIds:string[],user : UserEntity): Promise<PostEntity[]> {
    console.log(user.id)
    const query = this.dataSource
      .getRepository(SQLitePostEntity)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag');

    if (tagIds.length > 0) {
      query.andWhere('tag.id IN (:...ids)', { ids: tagIds });
    }

    if (!user ||!user.permissions.posts.canReadAllPosts()) {
      if (user) {
        query.andWhere('(post.status = :status OR post.authorId = :userId)', {
          status: 'accepted',
          userId: user.id,
        });
      } else {
        query.andWhere('post.status = :status', { status: 'accepted' });
      }
    }

    const data = await query.getMany();

    return data.map((post) => PostEntity.reconstitute({ ...post }));
  }

  public async getPostById(id: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { id }, relations: {tags : true} });

    return post ? PostEntity.reconstitute({ ...post }) : undefined;
  }

  public async createPost(input: PostEntity): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).save(input.toJSON());
  }

  public async updatePost(id: string, input: PostEntity): Promise<void> {
    var json = input.toJSON()
    delete json.tags
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .update(id, json);
  }

  public async deletePost(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).delete(id);
  }

  public async findBySlug(slug: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { slug },
      relations: ['author', 'tags'],
     });

    return post ? PostEntity.reconstitute({ ...post }) : undefined; 
  }

  public async addTag(id: string, idTag: string) {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .createQueryBuilder()
      .relation(SQLitePostEntity, 'tags')
      .of(id)
      .add(idTag);
  }

  public async removeTag(id: string, idTag: string) {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .createQueryBuilder()
      .relation(SQLitePostEntity, 'tags')
      .of(id)
      .remove(idTag);
  }
}

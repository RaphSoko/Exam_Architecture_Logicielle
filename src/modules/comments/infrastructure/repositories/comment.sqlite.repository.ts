import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { SQLiteCommentEntity } from '../entities/comment.sqlite.entity';
import { CountCommentDto } from '../../application/dtos/count-comment.dto';

@Injectable()
export class SQLiteCommentRepository implements CommentRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getComments(): Promise<CommentEntity[]> {
    const data = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .find();

    return data.map((comment) => CommentEntity.reconstitute({ ...comment }));
  }

  public async getPostComments(
    idPost: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: 'ASC' | 'DESC',
  ) : Promise<CommentEntity[]> {
    const query = this.dataSource.getRepository(SQLiteCommentEntity)
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.author', 'author') 
    .where('comment.postId = :idPost', { idPost })

    query.orderBy(`comment.${sortBy}`, order)

    query.skip((page - 1) * pageSize).take(pageSize);

    const data = await query.getMany(); 
    return data.map((comment) => CommentEntity.reconstitute({ ...comment }));
  }

  public async getCommentById(id: string): Promise<CommentEntity | undefined> {
    const comment = await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .findOne({ where: { id }, relations: { author: true } });

    return comment ? CommentEntity.reconstitute({ ...comment }) : undefined;
  }

  public async getPostCommentCount(idPost: string): Promise<CountCommentDto> {
    const query = this.dataSource
      .getRepository(SQLiteCommentEntity)
      .createQueryBuilder('comment')
      .where('comment.postId = :idPost', { idPost });
    let res = new CountCommentDto();
    res.postId = idPost;
    res.count = await query.getCount();
    return res;
  }

  public async createComment(input: CommentEntity): Promise<void> {
    this.dataSource.getRepository(SQLiteCommentEntity).save(input.toJSON());
  }

  public async updateComment(id: string, input: CommentEntity): Promise<void> {
    var postJson = input.toJSON();
    delete postJson.author;
    await this.dataSource
      .getRepository(SQLiteCommentEntity)
      .update(id, postJson);
  }

  public async deleteComment(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteCommentEntity).delete(id);
  }

}
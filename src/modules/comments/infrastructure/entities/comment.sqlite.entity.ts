import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { SQLiteUserEntity } from 'src/modules/users/infrastructure/entities/user.sqlite.entity';

@Entity('comments')
export class SQLiteCommentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  postId: string;

  @Column()
  content: string;

  @ManyToOne(() => SQLiteUserEntity)
  author: UserEntity

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
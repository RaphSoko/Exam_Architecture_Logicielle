import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { SQLiteUserEntity } from 'src/modules/users/infrastructure/entities/user.sqlite.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: PostStatus;

  @Column()
  authorId: string;

  @ManyToOne(() => SQLiteUserEntity)
  @JoinColumn({ name: 'authorId' }) // Lie la relation à la colonne authorId
  author: SQLiteUserEntity;

  @Column()
  slug: string;
}

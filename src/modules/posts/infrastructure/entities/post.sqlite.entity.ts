import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { SQLiteUserEntity } from 'src/modules/users/infrastructure/entities/user.sqlite.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tag.sqlite.entity';
import { TagEntity } from 'src/modules/tags/domain/entities/tag.entity';

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
  @JoinColumn({ name: 'authorId' })
  author: SQLiteUserEntity;

  @Column()
  slug: string;

  @ManyToMany(() => SQLiteTagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag_id',
    joinColumn: {
      name: 'post',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];
}

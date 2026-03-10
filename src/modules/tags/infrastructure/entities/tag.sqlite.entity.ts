import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { PostEntity } from 'src/modules/posts/domain/entities/post.entity';
import { SQLitePostEntity } from 'src/modules/posts/infrastructure/entities/post.sqlite.entity';


@Entity('tags')
export class SQLiteTagEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @ManyToMany(() => SQLitePostEntity, (post) => post.tags)
    posts: PostEntity[]
}
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('follows')
export class SQLiteFollowEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  followerId: string;

  @Column()
  followedId: string;

  @Column()
  followedAt: Date;
}
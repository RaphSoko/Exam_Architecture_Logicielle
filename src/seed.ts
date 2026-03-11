import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SQLitePostEntity } from './modules/posts/infrastructure/entities/post.sqlite.entity';
import { SQLiteUserEntity } from './modules/users/infrastructure/entities/user.sqlite.entity';
import { PostEntity } from './modules/posts/domain/entities/post.entity';
import { UserEntity } from './modules/users/domain/entities/user.entity';
import { SQLiteTagEntity } from './modules/tags/infrastructure/entities/tag.sqlite.entity';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [SQLitePostEntity, SQLiteUserEntity,SQLiteTagEntity],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(SQLiteUserEntity);
    const postRepo = dataSource.getRepository(SQLitePostEntity);
    const tagRepo = dataSource.getRepository(SQLiteTagEntity);

    await postRepo.clear(); 
    await userRepo.clear();
    await tagRepo.clear();

    console.log('Base de données nettoyée. Démarrage du seed...');
    
    const rawUsers = [
      {
        id: uuidv4(),
        username: 'reader_user',
        role: 'reader' as const,
        password: 'password123',
      },
      {
        id: uuidv4(),
        username: 'writer_user',
        role: 'writer' as const,
        password: 'password123',
      },
      {
        id: uuidv4(),
        username: 'moderator_user',
        role: 'moderator' as const,
        password: 'password123',
      },
      {
        id: uuidv4(),
        username: 'admin_user',
        role: 'admin' as const,
        password: 'password123',
      }
    ];

    const savedUsers: UserEntity[] = [];

    for (const raw of rawUsers) {
      const userDomain = UserEntity.reconstitute(raw);
      await userRepo.save(userDomain.toJSON());
      savedUsers.push(userDomain);
      console.log(`Utilisateur créé : ${userDomain.toJSON().username}`);
    }
    console.log(savedUsers[1].toJSON().username);
    const writer = savedUsers[1];

    const rawPosts = [
      {
        id: uuidv4(),
        title: 'My Draft Article',
        content: 'This is a draft',
        authorId: writer.id,
        status: 'draft' as const,
        slug: 'my-draft-article',
        tags: [],
      },
      {
        id: uuidv4(),
        title: 'Article Pending Review',
        content: 'Waiting for approval...',
        authorId: writer.id,
        status: 'waiting' as const,
        slug: 'article-pending-review',
        tags: [],
      },
      {
        id: uuidv4(),
        title: 'Published Article',
        content: 'This article is published.',
        authorId: writer.id,
        status: 'accepted' as const,
        slug: 'published-article',
        tags: [],
      },
      {
        id: uuidv4(),
        title: 'Rejected Article',
        content: 'This article was rejected.',
        authorId: writer.id,
        status: 'rejected' as const,
        slug: 'rejected-article',
        tags: [],
    }
    ];

    for (const raw of rawPosts) {
      const postDomain = PostEntity.reconstitute(raw);
      await postRepo.save(postDomain.toJSON());
      console.log(`Post créé : ${postDomain.toJSON().title}`);
    }

    console.log(' Seed terminé avec succès !');
  } catch (error) {
    console.error(' Erreur pendant le seed:', error);
  } finally {
    if (dataSource.isInitialized) {
    await dataSource.destroy();
    }
  }
}

runSeed();
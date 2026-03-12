import { Test, TestingModule } from '@nestjs/testing';
import { ChangeStatusPostUseCase } from './change-status-post.use-case';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { changeStatusPostDto } from '../dtos/change-status-post.dto';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

describe('ChangeStatusPostUseCase', () => {
  let useCase: ChangeStatusPostUseCase;
  let repository: jest.Mocked<PostRepository>;

  beforeEach(async () => {
    const mockRepo = {
      getPostById: jest.fn(),
      updatePost: jest.fn(),
    };

    const mockLoggingService = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeStatusPostUseCase,
        { provide: PostRepository, useValue: mockRepo },
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    useCase = module.get<ChangeStatusPostUseCase>(ChangeStatusPostUseCase);
    repository = module.get(PostRepository);
  });

  it('should allow an author to submit a draft for review (waiting)', async () => {
    // Arrange
    const postData = { id: 'post-1', authorId: 'author-id', status: 'draft', title: 'Titre', content: 'Contenu', slug: 'slug', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'author-id',username: 'Alice',role: 'writer',password: 'hash'});
    const input: changeStatusPostDto = { status: 'waiting' };

    repository.getPostById.mockResolvedValue(mockPost);

    // Act
    const result = await useCase.execute('post-1', input, author);

    // Assert
    expect(mockPost.status).toBe('waiting');
    expect(repository.updatePost).toHaveBeenCalled();
  });

  it('should allow an admin to accept a post that is in waiting status', async () => {
    // Arrange
    const postData = { id: 'post-1', authorId: 'author-id', status: 'waiting', title: 'Titre', content: 'Contenu', slug: 'slug', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const admin = UserEntity.reconstitute({id: 'admin-id',username: 'Bob',role: 'admin',password: 'hash'});
    const input: changeStatusPostDto = { status: 'accepted' };

    repository.getPostById.mockResolvedValue(mockPost);

    // Act
    const result = await useCase.execute('post-1', input, admin);

    // Assert
    expect(mockPost.status).toBe('accepted');
    expect(repository.updatePost).toHaveBeenCalled();
  });

  it('should throw ForbiddenException if an author tries to accept their own post', async () => {
    // Arrange
    const postData = { id: 'post-1', authorId: 'author-id', status: 'waiting', title: 'Titre', content: 'Contenu', slug: 'slug', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'author-id',username: 'Alice',role: 'writer',password: 'hash'});
    const input: changeStatusPostDto = { status: 'accepted' };

    repository.getPostById.mockResolvedValue(mockPost);

    // Act & Assert
    await expect(useCase.execute('post-1', input, author))
      .rejects.toThrow(ForbiddenException);
  });
});
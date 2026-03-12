import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommentUseCase } from './create-comment.use-case';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from 'src/modules/posts/domain/repositories/post.repository';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';
import { ForbiddenException} from '@nestjs/common';
import { PostEntity } from 'src/modules/posts/domain/entities/post.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('CreateCommentUseCase', () => {
  let useCase: CreateCommentUseCase;
  let commentRepo: jest.Mocked<CommentRepository>;
  let postRepo: jest.Mocked<PostRepository>;

  beforeEach(async () => {
    const mockCommentRepo = {
      createComment: jest.fn().mockResolvedValue(undefined),
    };
    const mockPostRepo = {
      getPostById: jest.fn(),
    };
    const mockLogger = {
      log: jest.fn(),
    };
    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentUseCase,
        { provide: CommentRepository, useValue: mockCommentRepo },
        { provide: PostRepository, useValue: mockPostRepo },
        { provide: LoggingService, useValue: mockLogger },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<CreateCommentUseCase>(CreateCommentUseCase);
    commentRepo = module.get(CommentRepository);
    postRepo = module.get(PostRepository);
  });

  it('should create a comment when post status is accepted', async () => {
    const currentUser = UserEntity.reconstitute({ id: 'u1', username: 'j', role: 'user', password: 'p' });
    
    const mockPost = PostEntity.reconstitute({
      id: 'post-ok',
      status: 'accepted',
      authorId: 'author', 
      title: 'Title', 
      content: 'Content', 
      slug: 'slug', 
      tags: []
    });

    const dto = { postId: 'post-ok', content: 'Super !' };

    postRepo.getPostById.mockResolvedValue(mockPost);

    await useCase.execute(dto, currentUser, mockPost.id);

    expect(commentRepo.createComment).toHaveBeenCalled();
  });

  it('should throw ForbiddenException if the post status is NOT accepted', async () => {
    // Arrange
    const currentUser = UserEntity.reconstitute({ id: 'u1', username: 'j', role: 'user', password: 'p' });
    
    const mockPost = PostEntity.reconstitute({
      id: 'post-not-ready',
      status: 'waiting',
      authorId: 'author', 
      title: 'Title', 
      content: 'Content', 
      slug: 'slug', 
      tags: []
    });

    const dto = { postId: 'post-not-ready', content: 'Trop tôt pour commenter' };

    postRepo.getPostById.mockResolvedValue(mockPost);

    // Act & Assert
    await expect(useCase.execute(dto, currentUser, mockPost.id))
      .rejects.toThrow(ForbiddenException); 
    expect(commentRepo.createComment).not.toHaveBeenCalled();
  });
});
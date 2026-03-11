import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  BadRequestException,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { GetPostBySlugUseCase } from '../../application/use-cases/find-by-slug.use-case';
import { UpdatePostSlugUseCase } from '../../application/use-cases/update-post-slug.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangeStatusPostUseCase } from '../../application/use-cases/change-status-post.use-case';
import { changeStatusPostDto } from '../../application/dtos/change-status-post.dto';
import { AddTagPostUseCase } from '../../application/use-cases/add-tag.use-case';
import { RemoveTagPostUseCase } from '../../application/use-cases/remove-tag.use-case';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly updatePostSlugUseCase: UpdatePostSlugUseCase,
    private readonly changeStatusPostUseCase: ChangeStatusPostUseCase,
    private readonly addTagPostUseCase: AddTagPostUseCase,
    private readonly removeTagPostUseCase: RemoveTagPostUseCase,
  ) {}

  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  @UseGuards(JwtAuthGuard)
    public async getPosts(
    @Requester() user: UserEntity,
    @Query('tags') tags?: string) {
    var tagsArray = tags ? tags.split(',') : []
    const posts = await this.getPostsUseCase.execute(tagsArray, user);

    return posts.map((p) => p.toJSON());
  }

  @ApiOperation({ summary: 'Get a post by slug' })
  @ApiResponse({ status: 200, description: 'The post has been successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':slug')
  @UseGuards(JwtAuthGuard) 
  public async getBySlug(
    @Requester() user: UserEntity, 
    @Param('slug') slug: string,
  ) {
    const post = await this.getPostBySlugUseCase.execute(slug, user);

    return post.toJSON();
  }


  //Not very useful anymore since it will be confused with the slug route
  @ApiOperation({ summary: 'Get a post by ID' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPostById(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    const post = await this.getPostByIdUseCase.execute(id, user);

    return post?.toJSON();
  }

  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: Omit<CreatePostDto, 'authorId'>,
  ) {
    return this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
  }

  @ApiOperation({ summary: 'Update an existing post' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  @ApiOperation({ summary: 'Update a post slug' })
  @ApiResponse({ status: 200, description: 'The post slug has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid slug format.' })
  @ApiResponse({ status:401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 409, description: 'Slug already used.' })
  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  public async updateSlug(
    @Param('id') id: string,
    @Body('slug') newSlug: string,
    @Requester() user: UserEntity,
  ) {
    if (!newSlug) {
      throw new BadRequestException('Le nouveau slug est requis');
    }

    const post = await this.updatePostSlugUseCase.execute(id, newSlug, user);
    return post.toJSON();
  }

  @ApiOperation({ summary: 'Change the status of a post' })
  @ApiResponse({ status: 200, description: 'The post status has been successfully changed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Patch('/status/:id')
  @UseGuards(JwtAuthGuard)
  public async changeStatus(
    @Param('id') id: string,
    @Body() status: changeStatusPostDto,
    @Requester() user: UserEntity,
  ) {
    return this.changeStatusPostUseCase.execute(id, status, user);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async delete(
    @Param('id') id: string, 
    @Requester() user: UserEntity) {
    return this.deletePostUseCase.execute(id, user);
  }

  // ROUTES POUR LES TAGS

  @ApiOperation({ summary: 'Add a tag to a post' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully added to the post.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post or tag not found.' })
  @ApiResponse({ status: 409, description: 'Tag already associated with the post.' })
  @Post(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  public async AddTag(
    @Requester() user: UserEntity,
    @Param('postId') idPost: string,
    @Param('tagId') idTag: string,
  ) {
    return this.addTagPostUseCase.execute(idPost, idTag, user);
  }

  @ApiOperation({ summary: 'Remove a tag from a post' })
  @ApiResponse({ status: 204, description: 'The tag has been successfully removed from the post.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post or tag not found.' })
  @Delete(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async RemoveTag(
    @Requester() user: UserEntity,
    @Param('postId') idPost: string,
    @Param('tagId') idTag: string,
  ) {
    return this.removeTagPostUseCase.execute(idPost, idTag, user);
  }
}

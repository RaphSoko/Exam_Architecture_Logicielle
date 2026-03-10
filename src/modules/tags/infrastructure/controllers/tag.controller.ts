import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,Patch,Post,UseGuards} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { GetTagsUseCase } from '../../application/use-cases/get-tag.use-case';
import { CreateTagDto } from '../../application/dtos/create-tag.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { UpdateTagDto } from '../../application/dtos/update-tag.dto';
import { UpdateTagsUseCase } from '../../application/use-cases/update-tag.use-case';
import { DeleteTagsUseCase } from '../../application/use-cases/delete-tag.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';



@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagsUseCase: CreateTagUseCase,
    private readonly getTagsUseCase: GetTagsUseCase,
    private readonly updateTagsUseCase: UpdateTagsUseCase,
    private readonly deleteTagsUseCase: DeleteTagsUseCase,

  ) {}

  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'The tags have been successfully retrieved.' })
  @Get()
  public async getTags() {
    const posts = await this.getTagsUseCase.execute();

    return posts.map((p) => p.toJSON());
  }

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'The tag has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Conflict. A tag with the same name already exists.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createTag(
    @Requester() user: UserEntity,
    @Body() input: CreateTagDto,
  ) {
    return this.createTagsUseCase.execute(
      input,
      user,
    );
  }

  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Conflict. A tag with the same name already exists.' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateTag(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: UpdateTagDto,
  ) {
    return this.updateTagsUseCase.execute(id, input, user);
  }

  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 204, description: 'The tag has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTag(
    @Requester() user: UserEntity,
    @Param('id') id: string) {
    return this.deleteTagsUseCase.execute(id, user);
  }
}
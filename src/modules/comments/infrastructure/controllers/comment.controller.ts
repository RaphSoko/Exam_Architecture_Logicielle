import { Controller, Patch, UseGuards, Param, Body, Delete } from "@nestjs/common";
import { Requester } from "src/modules/shared/auth/infrastructure/decorators/requester.decorator";
import { JwtAuthGuard } from "src/modules/shared/auth/infrastructure/guards/jwt-auth.guard";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { CreateCommentDto } from "../../application/dtos/create-comment.dto";
import { UpdateCommentUseCase } from "../../application/use-cases/update-comment.use-case";
import { DeleteCommentUseCase } from "../../application/use-cases/delete-comment.use-case";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('comments')
export class CommentController {
  constructor(
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,

  ) {}

  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: CreateCommentDto,
  ) {
    return this.updateCommentUseCase.execute(id, input, user);
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 204, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status:401, description: 'Unauthorized.' })
  @ApiResponse({ status:403, description: 'Forbidden.' })
  @ApiResponse({ status:404, description: 'Comment not found.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    return this.deleteCommentUseCase.execute(id, user);
  }

}
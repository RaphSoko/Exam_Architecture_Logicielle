import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { GetUserFollowerUseCase } from '../../application/use-cases/get-user-follower.use-case';
import { GetUserFollowingUseCase } from '../../application/use-cases/get-user-following.use-case';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from 'src/modules/shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../domain/entities/user.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly getUserFollowersUseCase: GetUserFollowerUseCase,
    private readonly getUserFollowingsUseCase: GetUserFollowingUseCase,
  ) {}

  @Get()
  public async listUsers() {
    const users = await this.listUsersUseCase.execute();
    return users.map((u) => u.toJSON());
  }

  @Get(':id')
  public async getUserById(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return user?.toJSON();
  }

  @Post()
  public async createUser(@Body() input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  @Patch(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, input);
  }

  @Delete(':id')
  public async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }

  //ROUTES POUR LES FOLLOWS

  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully followed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Conflict. Already following this user.' })
  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  public async followUser(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    return await this.followUserUseCase.execute(id, user);
  }

  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiResponse({ status: 200, description: 'List of followers retrieved successfully.' })
  @Get(':id/followers')
  public async getUserFollowers(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    return await this.getUserFollowersUseCase.execute(id, page, pageSize);
  }

  @ApiOperation({ summary: 'Get followings of a user' })
  @ApiResponse({ status: 200, description: 'List of followings retrieved successfully.' })
  @Get(':id/followings')
  public async getUserFollowings(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    return await this.getUserFollowingsUseCase.execute(id, page, pageSize);
  }

  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully unfollowed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  public async unfollowUser(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    return await this.unfollowUserUseCase.execute(id, user);
  }
}

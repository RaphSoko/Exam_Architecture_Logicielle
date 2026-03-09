import { ForbiddenException, Injectable } from "@nestjs/common";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { PostRepository } from "../../domain/repositories/post.repository";
import { changeStatusPostDto } from "../dtos/change-status-post.dto";

@Injectable()
export class ChangeStatusPostUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly loggingService: LoggingService,
    ){}

    public async execute(id: string, input: changeStatusPostDto, currentUser: UserEntity): Promise<void> {
        const post = await this.postRepository.getPostById(id);

        if(post){
            if( !(post.status === 'accepted' || post.status === 'rejected') && input.status === 'waiting' && currentUser.permissions.posts.canSubmitPost(post)){
                post.update(undefined, undefined, input.status);
            }
            else if((input.status === 'accepted' || input.status === 'rejected') &&  post.status === 'waiting' && currentUser.permissions.posts.canModeratePost(post)){
            post.update(undefined, undefined, input.status);
            }
            else {
                throw new ForbiddenException("You do not have permission to change the status of this post.");
            }
            await this.postRepository.updatePost(id, post);
        }
    }
}
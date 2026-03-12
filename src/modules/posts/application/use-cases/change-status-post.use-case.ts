import { ForbiddenException, Injectable } from "@nestjs/common";
import { LoggingService } from "src/modules/shared/logging/domain/services/logging.service";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { PostRepository } from "../../domain/repositories/post.repository";
import { changeStatusPostDto } from "../dtos/change-status-post.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { log } from "console";
import { PostWaitingEvent } from "../../domain/events/post-waiting.event";
import { PostAcceptedEvent } from "../../domain/events/post-accepted.event";
import { PostRejectedEvent } from "../../domain/events/post-rejected.event.";
import { PostCreatedEvent } from "../../domain/events/post-created.event";

@Injectable()
export class ChangeStatusPostUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly loggingService: LoggingService,
        private readonly eventEmitter: EventEmitter2,
    ){}

    public async execute(id: string, input: changeStatusPostDto, currentUser: UserEntity): Promise<void> {
        this.loggingService.log('ChangeStatusPostUseCase.execute');
        const post = await this.postRepository.getPostById(id);

        if(post){
            if( !(post.status === 'accepted' || post.status === 'rejected') && input.status === 'waiting' && currentUser.permissions.posts.canSubmitPost(post)){
                post.update(undefined, undefined, input.status);
                this.eventEmitter.emit(PostWaitingEvent, {
                    postId: post.id,
                    postTitle: post.getTitle(),
                    userId: currentUser.id
                });
            }
            else if((input.status === 'accepted' || input.status === 'rejected') &&  post.status === 'waiting' && currentUser.permissions.posts.canModeratePost(post)){
            post.update(undefined, undefined, input.status);
            switch(input.status) {
                case 'accepted':
                    this.eventEmitter.emit(PostAcceptedEvent, {
                        postId: post.id,
                        postTitle: post.getTitle(),
                        userId: currentUser.id
                    });
                    break;
                case 'rejected':
                    this.eventEmitter.emit(PostRejectedEvent, {
                        postId: post.id,
                        postTitle: post.getTitle(),
                        userId: currentUser.id
                    });
                    break;
                
                } 
                this.eventEmitter.emit(PostCreatedEvent, {
                postId: post.id,
                postTitle: post.getTitle(),
                userId: currentUser.id
            }); 
            }
            else {
                throw new ForbiddenException("You do not have permission to change the status of this post.");
            }
            await this.postRepository.updatePost(id, post);
        }
    }
}
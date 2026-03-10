import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotCreatePostException extends DomainException {
  constructor() {
    super(
      'You do not have permission to update the tags of this post',
      'USER_CANNOT_UPDATE_POST_TAG',
    );
  }
}
import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotCreateTagException extends DomainException {
  constructor() {
    super(
      'You do not have permission to create a tag',
      'USER_CANNOT_CREATE_TAG',
    );
  }
}
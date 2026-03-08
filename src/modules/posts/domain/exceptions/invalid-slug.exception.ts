import { BadRequestException } from '@nestjs/common';

export class InvalidSlugException extends BadRequestException {
  constructor() {
    super(
        "Invalid slug format."
    );
  }
}
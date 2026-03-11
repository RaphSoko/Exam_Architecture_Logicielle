import { BadRequestException } from "@nestjs/common";

export class CommentContent {
  private value: string;

  constructor(input: string) {
    this.validate(input);
    this.value = input;
  }

  private validate(input: string) {
    if (input.length <= 1 || input.length > 1000 || input.trim().length === 0) {
      throw new BadRequestException('Content must be between 2 and 1000 characters and cannot be empty');
    }
  }

  public toString() {
    return this.value;
  }
}
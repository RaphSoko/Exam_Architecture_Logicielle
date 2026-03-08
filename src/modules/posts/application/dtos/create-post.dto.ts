export class CreatePostDto {
  readonly title: string;
  readonly content: string;
  readonly authorId: string;
  readonly slug?: string;
}

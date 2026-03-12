import { v4 } from 'uuid';

export class NotificationEntity {
  private _type: string;
  private _title: string;
  private _message: string;
  private _createdAt: Date;
  private _link: string;
  private _isRead: boolean;
  private _userId: string;

  private constructor(
    readonly id: string,
    type: string,
    title: string,
    message: string,
    createdAt: Date,
    link: string,
    isRead: boolean,
    userId: string
  ) {
    this._type = type;
    this._title = title;
    this._message = message;
    this._createdAt = createdAt;
    this._link = link;
    this._isRead = isRead
    this._userId = userId
  }

  public get isRead() {
    return this._isRead;
  }

  public get userId() {
    return this._userId;
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new NotificationEntity(
      input.id as string,
      input.type as string,
      input.title as string,
      input.message as string,
      input.createdAt as Date,
      input.link as string,
      input.isRead as boolean,
      input.userId as string
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this._type,
      title: this._title,
      message: this._message,
      createdAt: this._createdAt.toString(),
      link: this._link,
      isRead: this._isRead,
      userId: this._userId,
    };
  }

  public static create(
    type: string,
    title: string,
    message: string,
    link: string,
    userId: string
  ): NotificationEntity {
    return new NotificationEntity(
      v4(),
      type,
      title,
      message,
      new Date(Date.now()),
      link,
      false,
      userId
    );
  }

  public update(read: boolean) {

    this._isRead = read

  }
}
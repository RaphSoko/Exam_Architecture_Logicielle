export class TagName {
  private readonly value: string;

  constructor(name: string) {
    this.validate(name);
    this.value = name.trim();
  }

  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    if (name.length > 50) {
      throw new Error('Name is too long (>50 characters)');
    }

    if (name.length < 2) {
      throw new Error('Name is too short (<2 characters)');
    }

    const regex = /^[a-z0-9-]+$/;
    if(!regex.test(name)) {
        throw new Error('Name can only contain lowercase letters, numbers and hyphens');
    }
  }

  toString(): string {
    return this.value;
  }

  isValid(): boolean {
    return this.value.length >= 3;
  }
}
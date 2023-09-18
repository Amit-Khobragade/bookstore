export class Author {
  constructor(
    public author_id: string,
    public name: string,
    public photo: string,
    public about: string,
  ) {}

  static fromObject(id: string, object: Partial<Author>): Author {
    return new Author(id, object.name, object.photo, object.about);
  }

  toPureJsObject() {
    return Object.assign({}, this);
  }
}

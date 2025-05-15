import { v4 as uuidv4 } from 'uuid';

interface IUser {
  nickname: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  photoProfile?: string;
  description?: string;
}

interface IUserUpdate {
  nickname?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  photoProfile?: string;
  description?: string;
}

class User {
  private id: string;
  private nickname: string;
  private username: string;
  private email: string;
  private password: string;
  private phone: string;
  private photoProfile: string;
  private description: string;
  private privacity: boolean;
  private createdAt: Date;
  private posts: Post[] = [];

  constructor() {
    this.id = uuidv4();
    this.nickname = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.phone = '';
    this.photoProfile = '';
    this.description = '';
    this.privacity = false;
    this.createdAt = new Date();
  }

  public registerUser(user: IUser): void {
    this.nickname = user.nickname;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.phone = user.phone;
  }

  public updateUser(user: IUserUpdate): void {
    if (user.nickname) this.nickname = user.nickname;
    if (user.username) this.username = user.username;
    if (user.email) this.email = user.email;
    if (user.password) this.password = user.password;
    if (user.phone) this.phone = user.phone;
    if (user.description) this.description = user.description;
    if (user.photoProfile) this.photoProfile = user.photoProfile;
  }

  public deleteUser(): void {
    console.log(`User ${this.id} was deleted`);
  }

  public login(email: string, password: string): IUser | void {
    if (this.email !== email || this.password !== password) {
      console.log("Login inválido!");
    } else {
      return this.getPublicUserData();
    }
  }

  public searchUserByUsername(username: string): IUser | void {
    if (this.username === username) {
      return this.getPublicUserData();
    } else {
      console.log(`Usuário ${username} não encontrado`);
    }
  }

  private getPublicUserData(): IUser {
    return {
      nickname: this.nickname,
      username: this.username,
      email: this.email,
      password: this.password,
      phone: this.phone
    };
  }

  public togglePrivacity(): void {
    this.privacity = !this.privacity;
  }

  public addPost(post: Post): void {
    this.posts.push(post);
  }

  public removePost(postId: string): void {
    this.posts = this.posts.filter(p => p.getId() !== postId);
  }

  public getPosts(): Post[] {
    return this.posts;
  }

  public getId(): string {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public isPublic(): boolean {
    return this.privacity;
  }
}

type FollowState = 'pending' | 'accepted' | 'rejected';

class Connection {
  static connections: Connection[] = [];

  private id: string;
  private followUserId: string;
  private followingUserId: string;
  private dateFollow: Date;
  private state: FollowState;

  constructor(followUserId: string, followingUserId: string) {
    this.id = uuidv4();
    this.followUserId = followUserId;
    this.followingUserId = followingUserId;
    this.dateFollow = new Date();
    this.state = 'pending';
  }

  public getId(): string {
    return this.id;
  }

  public getFollowUserId(): string {
    return this.followUserId;
  }

  public getFollowingUserId(): string {
    return this.followingUserId;
  }

  public getDateFollow(): Date {
    return this.dateFollow;
  }

  public getState(): FollowState {
    return this.state;
  }

  public followUser(): void {
    const exists = Connection.connections.some(c =>
      c.followUserId === this.followUserId &&
      c.followingUserId === this.followingUserId
    );
  
    if (exists) {
      throw new Error('Solicitação já existente.');
    }
  
    Connection.connections.push(this);
  }

  public static unfollow(followUserId: string, followingUserId: string): boolean {
    const connection = Connection.findAcceptedConnection(followUserId, followingUserId);

    if (!connection) {
      console.warn('Nenhuma conexão aceita foi encontrada para desfazer.');
      return false;
    }

    const index = Connection.connections.findIndex(c => c.id === connection.getId());

    if (index !== -1) {
      Connection.connections.splice(index, 1);
      return true;
    }

    return false;
  }

  public static findAcceptedConnection(followUserId: string, followingUserId: string): Connection | undefined {
    return Connection.connections.find(c =>
      c.followUserId === followUserId &&
      c.followingUserId === followingUserId &&
      c.state === 'accepted'
    );
  }

  public static listFollowers(userId: string): Connection[] {
    return Connection.connections.filter(c =>
      c.followingUserId === userId && c.state === 'accepted'
    );
  }

  public static listFollowing(userId: string): Connection[] {
    return Connection.connections.filter(c =>
      c.followUserId === userId && c.state === 'accepted'
    );
  }

  public static listPendingRequests(userId: string): Connection[] {
    return Connection.connections.filter(c =>
      c.followingUserId === userId && c.state === 'pending'
    );
  }

  public accept(userId: string): void {
    if (this.followingUserId !== userId) {
      throw new Error('Você não tem permissão para aceitar esta solicitação.');
    }

    this.state = 'accepted';
  }

  public reject(userId: string): void {
    if (this.followingUserId !== userId) {
      throw new Error('Você não tem permissão para rejeitar esta solicitação.');
    }
  }
}

class Location {
  private country: string;
  private region: string;
  private city: string;
  private description: string;
  private posts: Post[];

  constructor(country: string, region: string, city: string, description: string) {
    this.country = country;
    this.region = region;
    this.city = city;
    this.description = description;
    this.posts = [];
  }

  public getCountry(): string {
    return this.country;
  }

  public getRegion(): string {
    return this.region;
  }

  public getCity(): string {
    return this.city;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPosts(): Post[] {
    return this.posts;
  }

  public addPost(post: Post): void {
    if (!this.posts.includes(post)) {
      this.posts.push(post);
      post.addLocation(this);
    }
  }

  public removePost(post: Post): void {
    this.posts = this.posts.filter(p => p !== post);
    post.removeLocation(this);
  }
}

abstract class PostComponent {
  protected id: string;
  protected order: number;

  constructor(order: number) {
    this.id = uuidv4();
    this.order = order;
  }

  public getId(): string {
    return this.id;
  }

  public getOrder(): number {
    return this.order;
  }

  public setOrder(order: number): void {
    this.order = order;
  }

  public abstract getType(): string;
}

class Video extends PostComponent {
  private url: string;
  private duration: number;

  constructor(order: number, url: string, duration: number) {
    super(order);
    this.url = url;
    this.duration = duration;
  }

  public getUrl(): string {
    return this.url;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getType(): string {
    return 'video';
  }
}

class Photo extends PostComponent {
  private url: string;
  private caption: string;

  constructor(order: number, url: string, caption: string) {
    super(order);
    this.url = url;
    this.caption = caption;
  }

  public getUrl(): string {
    return this.url;
  }

  public getCaption(): string {
    return this.caption;
  }

  public getType(): string {
    return 'photo';
  }
}

class TextComponent extends PostComponent {
  private content: string;

  constructor(order: number, content: string) {
    super(order);
    this.content = content;
  }

  public getContent(): string {
    return this.content;
  }

  public getType(): string {
    return 'text';
  }
}

class Post {
  private id: string;
  private description: string;
  private privacity: boolean;
  private likeNumber: number;
  private components: PostComponent[];
  private locations: Location[];
  private createdAt: Date;
  private owner: User;

  constructor(owner: User, description: string, privacity: boolean = true) {
    this.id = uuidv4();
    this.owner = owner;
    this.description = description;
    this.privacity = privacity;
    this.likeNumber = 0;
    this.components = [];
    this.locations = [];
    this.createdAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getOwner(): User {
    return this.owner;
  }

  public getDescription(): string {
    return this.description;
  }

  public isPublic(): boolean {
    return this.privacity;
  }

  public getLikeNumber(): number {
    return this.likeNumber;
  }

  public getComponents(): PostComponent[] {
    return this.components;
  }

  public getLocations(): Location[] {
    return this.locations;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setDescription(desc: string): void {
    this.description = desc;
  }

  public setPrivacity(state: boolean): void {
    this.privacity = state;
  }

  public addLike(): void {
    this.likeNumber++;
  }

  public removeLike(): void {
    if (this.likeNumber > 0) {
      this.likeNumber--;
    }
  }

  public togglePrivacity(): void {
    this.privacity = !this.privacity;
  }

  public addComponent(component: PostComponent): void {
    this.components.push(component);
    this.sortComponentsByOrder();
  }

  public removeComponent(componentId: string): void {
    this.components = this.components.filter(c => c.getId() !== componentId);
  }

  private sortComponentsByOrder(): void {
    this.components.sort((a, b) => a.getOrder() - b.getOrder());
  }

  public addLocation(location: Location): void {
    if (!this.locations.includes(location)) {
      this.locations.push(location);
      location.addPost(this);
    }
  }

  public removeLocation(location: Location): void {
    this.locations = this.locations.filter(l => l !== location);
    location.removePost(this);
  }

  public listLocations(): Location[] {
    return this.locations;
  }

  public clear(): void {
    this.components = [];
    this.locations.forEach(loc => loc.removePost(this));
    this.locations = [];
    this.likeNumber = 0;
  }
}

class Comment {
  private static comments: Comment[] = [];

  private id: string;
  private content: string;
  private userId: string;
  private postId: string;
  private createdAt: Date;

  constructor(content: string, userId: string, postId: string) {
    this.id = uuidv4();
    this.content = content;
    this.userId = userId;
    this.postId = postId;
    this.createdAt = new Date();
  }

  public addComment(): void {
    Comment.comments.push(this);
  }

  public static editComment(commentId: string, newContent: string): boolean {
    const comment = Comment.comments.find(c => c.id === commentId);
    if (!comment) {
      console.warn(`Comentário com ID ${commentId} não encontrado.`);
      return false;
    }
    comment.content = newContent;
    return true;
  }

  public deleteComment(): boolean {
    const index = Comment.comments.findIndex(c => c.id === this.id);
    if (index !== -1) {
      Comment.comments.splice(index, 1);
      return true;
    }
    return false;
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPostId(): string {
    return this.postId;
  }

  public getContent(): string {
    return this.content;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public static getCommentsByPost(postId: string): Comment[] {
    return Comment.comments.filter(c => c.postId === postId);
  }

  public static getCommentsByUser(userId: string): Comment[] {
    return Comment.comments.filter(c => c.userId === userId);
  }
}

class Tag {
  private static tags: Tag[] = [];

  private id: string;
  private name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  public static createTag(name: string): Tag {
    const existing = Tag.tags.find(tag => tag.name === name);
    if (existing) {
      throw new Error(`Tag com nome "${name}" já existe.`);
    }
    const tag = new Tag(name);
    Tag.tags.push(tag);
    return tag;
  }

  public static deleteTag(id: string): boolean {
    const index = Tag.tags.findIndex(tag => tag.id === id);
    if (index !== -1) {
      Tag.tags.splice(index, 1);
      return true;
    }
    return false;
  }

  public static findByName(name: string): Tag | undefined {
    return Tag.tags.find(tag => tag.name === name);
  }

  public static findById(id: string): Tag | undefined {
    return Tag.tags.find(tag => tag.id === id);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}

class PostTag {
  private static postTags: PostTag[] = [];

  private id: string;
  private postId: string;
  private tagId: string;
  private createdAt: Date;

  constructor(postId: string, tagId: string) {
    this.id = uuidv4();
    this.postId = postId;
    this.tagId = tagId;
    this.createdAt = new Date();
  }

  public static addTagToPost(postId: string, tagId: string): PostTag {
    const exists = PostTag.postTags.some(pt => pt.postId === postId && pt.tagId === tagId);
    if (exists) {
      throw new Error("Essa tag já foi associada a esse post.");
    }

    const postTag = new PostTag(postId, tagId);
    PostTag.postTags.push(postTag);
    return postTag;
  }

  public static removeTagFromPost(postId: string, tagId: string): boolean {
    const index = PostTag.postTags.findIndex(pt => pt.postId === postId && pt.tagId === tagId);
    if (index !== -1) {
      PostTag.postTags.splice(index, 1);
      return true;
    }
    return false;
  }

  public static getTagsByPost(postId: string): Tag[] {
    const tagsIds = PostTag.postTags
      .filter(pt => pt.postId === postId)
      .map(pt => pt.tagId);

    return tagsIds.map(id => Tag.findById(id)).filter((t): t is Tag => !!t);
  }

  public static getPostsByTag(tagId: string): string[] {
    return PostTag.postTags
      .filter(pt => pt.tagId === tagId)
      .map(pt => pt.postId);
  }

  public getId(): string {
    return this.id;
  }

  public getPostId(): string {
    return this.postId;
  }

  public getTagId(): string {
    return this.tagId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}

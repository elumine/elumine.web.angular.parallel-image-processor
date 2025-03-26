export default class Post {
    id: string;
    title: string;
    
    constructor(post: any) {
        this.id = post.id;
        this.title = post.title;
    }
}

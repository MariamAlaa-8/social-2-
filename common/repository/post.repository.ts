import { PostModel } from "../../DB/models/post.model";
import { DatabaseRepository } from "./base.repository";
class PostRepository extends DatabaseRepository<any> {
  constructor() {
    super(PostModel);
  }
}
export const postRepository = new PostRepository();
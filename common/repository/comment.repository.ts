import { CommentModel } from "../../DB/models/comment.model";
import { DatabaseRepository } from "./base.repository";

class CommentRepository extends DatabaseRepository<any> {
  constructor() {
    super(CommentModel);
  }
}
export const commentRepository = new CommentRepository();
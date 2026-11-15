"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const post_model_1 = require("../../DB/models/post.model");
const base_repository_1 = require("./base.repository");
class PostRepository extends base_repository_1.DatabaseRepository {
    constructor() {
        super(post_model_1.PostModel);
    }
}
exports.postRepository = new PostRepository();

import { Router, Request } from "express";
import { validation } from "../../middleware/validation.middleware";
import { ResponseFormatter } from "../../middleware/response.middleware";
import { PostService } from "./post.service";
import * as validators from "./post.validation";
import { authentication } from "../authenticantion/auth.middlewere";

const router = Router();
const postService = new PostService();

router.use(authentication()); 

router.post("/", validation(validators.createPost), ResponseFormatter(async (req: Request) => {
    return { data: await postService.createPost(req.auth?.user._id, req.body), status: 201 };
}));

router.get("/", ResponseFormatter(async (req: Request) => {
    return { data: await postService.getAllMyPosts(req.auth?.user._id) };
}));

router.get("/:postId", validation(validators.postIdParam), ResponseFormatter(async (req: Request) => {
    return { data: await postService.getSinglePost(req.params.postId as string) };
}));

router.patch("/:postId", validation(validators.updatePost), ResponseFormatter(async (req: Request) => {
    return { data: await postService.updatePost(req.auth?.user._id, req.params.postId as string, req.body) };
}));

router.delete("/:postId", validation(validators.postIdParam), ResponseFormatter(async (req: Request) => {
    return { data: await postService.deletePost(req.auth?.user._id, req.params.postId as string) };
}));

export default router;
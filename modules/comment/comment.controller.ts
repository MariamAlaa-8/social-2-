import { Router, Request } from "express";
import { validation } from "../../middleware/validation.middleware";
import { ResponseFormatter } from "../../middleware/response.middleware";

import { CommentService } from "./comment.service";
import * as validators from "./comment.validation";
import { authentication } from "../authenticantion/auth.middlewere";

const router = Router();
const commentService = new CommentService();

router.use(authentication());

router.post("/", validation(validators.createComment), ResponseFormatter(async (req: Request) => {
    const { postId, content } = req.body;
    return { data: await commentService.createComment(req.auth?.user._id, postId, content), status: 201 };
}));

router.get("/post/:postId", validation(validators.postIdParam), ResponseFormatter(async (req: Request) => {
    return { data: await commentService.getPostComments(req.params.postId as string) };
}));

router.get("/:commentId", validation(validators.commentIdParam), ResponseFormatter(async (req: Request) => {
    return { data: await commentService.getSingleComment(req.params.commentId as string) };
}));


router.patch("/:commentId", validation(validators.updateComment), ResponseFormatter(async (req: Request) => {
    return { data: await commentService.updateComment(req.auth?.user._id, req.params.commentId as string, req.body.content) };
}));


router.delete("/:commentId", validation(validators.commentIdParam), ResponseFormatter(async (req: Request) => {
    return { data: await commentService.deleteComment(req.auth?.user._id, req.params.commentId as string) };
}));

export default router;
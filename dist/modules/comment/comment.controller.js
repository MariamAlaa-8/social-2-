"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const response_middleware_1 = require("../../middleware/response.middleware");
const comment_service_1 = require("./comment.service");
const validators = __importStar(require("./comment.validation"));
const auth_middlewere_1 = require("../authenticantion/auth.middlewere");
const router = (0, express_1.Router)();
const commentService = new comment_service_1.CommentService();
router.use((0, auth_middlewere_1.authentication)());
router.post("/", (0, validation_middleware_1.validation)(validators.createComment), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    const { postId, content } = req.body;
    return { data: await commentService.createComment(req.auth?.user._id, postId, content), status: 201 };
}));
router.get("/post/:postId", (0, validation_middleware_1.validation)(validators.postIdParam), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await commentService.getPostComments(req.params.postId) };
}));
router.get("/:commentId", (0, validation_middleware_1.validation)(validators.commentIdParam), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await commentService.getSingleComment(req.params.commentId) };
}));
router.patch("/:commentId", (0, validation_middleware_1.validation)(validators.updateComment), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await commentService.updateComment(req.auth?.user._id, req.params.commentId, req.body.content) };
}));
router.delete("/:commentId", (0, validation_middleware_1.validation)(validators.commentIdParam), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await commentService.deleteComment(req.auth?.user._id, req.params.commentId) };
}));
exports.default = router;

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
const post_service_1 = require("./post.service");
const validators = __importStar(require("./post.validation"));
const auth_middlewere_1 = require("../authenticantion/auth.middlewere");
const router = (0, express_1.Router)();
const postService = new post_service_1.PostService();
router.use((0, auth_middlewere_1.authentication)());
router.post("/", (0, validation_middleware_1.validation)(validators.createPost), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await postService.createPost(req.auth?.user._id, req.body), status: 201 };
}));
router.get("/", (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await postService.getAllMyPosts(req.auth?.user._id) };
}));
router.get("/:postId", (0, validation_middleware_1.validation)(validators.postIdParam), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await postService.getSinglePost(req.params.postId) };
}));
router.patch("/:postId", (0, validation_middleware_1.validation)(validators.updatePost), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await postService.updatePost(req.auth?.user._id, req.params.postId, req.body) };
}));
router.delete("/:postId", (0, validation_middleware_1.validation)(validators.postIdParam), (0, response_middleware_1.ResponseFormatter)(async (req) => {
    return { data: await postService.deletePost(req.auth?.user._id, req.params.postId) };
}));
exports.default = router;

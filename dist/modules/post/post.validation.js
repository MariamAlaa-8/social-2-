"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdParam = exports.updatePost = exports.createPost = void 0;
const zod_1 = require("zod");
const validation_1 = require("../../common/utils/validation");
const createPost = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            content: zod_1.z.string().min(1, "Content is required").max(1000),
        })
    });
};
exports.createPost = createPost;
const updatePost = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            content: zod_1.z.string().min(1).max(1000).optional(),
        }),
        params: zod_1.z.strictObject({
            postId: validation_1.generalValidationFields.id(lang)
        })
    });
};
exports.updatePost = updatePost;
const postIdParam = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            postId: validation_1.generalValidationFields.id(lang)
        })
    });
};
exports.postIdParam = postIdParam;

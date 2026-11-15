"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdParam = exports.commentIdParam = exports.updateComment = exports.createComment = void 0;
const zod_1 = require("zod");
const validation_1 = require("../../common/utils/validation");
const createComment = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            content: zod_1.z.string().min(1, "Content is required").max(500),
            postId: validation_1.generalValidationFields.id(lang)
        })
    });
};
exports.createComment = createComment;
const updateComment = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            content: zod_1.z.string().min(1).max(500).optional(),
        }),
        params: zod_1.z.strictObject({
            commentId: validation_1.generalValidationFields.id(lang)
        })
    });
};
exports.updateComment = updateComment;
const commentIdParam = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            commentId: validation_1.generalValidationFields.id(lang)
        })
    });
};
exports.commentIdParam = commentIdParam;
const postIdParam = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            postId: validation_1.generalValidationFields.id(lang)
        })
    });
};
exports.postIdParam = postIdParam;

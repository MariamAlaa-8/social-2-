import { z } from "zod";
import { LanguageEnum } from "../../common/enum/index";
import { generalValidationFields } from "../../common/utils/validation";

export const createPost = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            content: z.string().min(1, "Content is required").max(1000),
        })
    })
}

export const updatePost = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            content: z.string().min(1).max(1000).optional(),
        }),
        params: z.strictObject({
            postId: generalValidationFields.id(lang)
        })
    })
}

export const postIdParam = (lang: LanguageEnum) => {
    return z.object({
        params: z.strictObject({
            postId: generalValidationFields.id(lang)
        })
    })
}
import { z } from "zod";
import { LanguageEnum } from "../../common/enum/index";
import { generalValidationFields } from "../../common/utils/validation";

export const createComment = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            content: z.string().min(1, "Content is required").max(500),
            postId: generalValidationFields.id(lang)
        })
    })
}

export const updateComment = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            content: z.string().min(1).max(500).optional(),
        }),
        params: z.strictObject({
            commentId: generalValidationFields.id(lang)
        })
    })
}

export const commentIdParam = (lang: LanguageEnum) => {
    return z.object({
        params: z.strictObject({
            commentId: generalValidationFields.id(lang)
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
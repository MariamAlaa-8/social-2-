import { NextFunction, Request, RequestHandler, Response } from "express"
import { BadException } from "../common/exception"
import { processMulterUpload } from "../common/utils/multer"

export const uploadMiddleware = ({
    isRequired = true,
    multerMiddleware,
    custompath = "general",
    validation = []}: { isRequired?: boolean, multerMiddleware: RequestHandler, custompath?: string, validation: string[] }) => {
 
    return (req: Request, res: Response, next:NextFunction) => {
        multerMiddleware(req, res, async (error?: any) => {
            if (error) {
                next(new Error(error.message, { cause: { status: 400 } }))
                return
            }
            try {
                
                const hasSingleFile = !!req.file
                const hasArrayFiles = Array.isArray(req.files) && req.files.length > 0
                const hasFieldFiles = typeof req.files == "object" && !Array.isArray(req.files) && req.files !== null && Object.keys(req.files).length > 0
                const hasAnyFile = hasSingleFile || hasArrayFiles || hasFieldFiles
                
                if (isRequired && !hasAnyFile) {
                    next(new Error(error.message, { cause: { status: 400 } }))
                    return
                }
                await processMulterUpload({ custompath, validation, req })
                next()
            } catch (error: any) {
              next(new Error(error.message, { cause: { status: 400 } }))
            }
        })
    }
}

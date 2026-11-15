"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = require("../common/utils/multer");
const uploadMiddleware = ({ isRequired = true, multerMiddleware, custompath = "general", validation = [] }) => {
    return (req, res, next) => {
        multerMiddleware(req, res, async (error) => {
            if (error) {
                next(new Error(error.message, { cause: { status: 400 } }));
                return;
            }
            try {
                const hasSingleFile = !!req.file;
                const hasArrayFiles = Array.isArray(req.files) && req.files.length > 0;
                const hasFieldFiles = typeof req.files == "object" && !Array.isArray(req.files) && req.files !== null && Object.keys(req.files).length > 0;
                const hasAnyFile = hasSingleFile || hasArrayFiles || hasFieldFiles;
                if (isRequired && !hasAnyFile) {
                    next(new Error(error.message, { cause: { status: 400 } }));
                    return;
                }
                await (0, multer_1.processMulterUpload)({ custompath, validation, req });
                next();
            }
            catch (error) {
                next(new Error(error.message, { cause: { status: 400 } }));
            }
        });
    };
};
exports.uploadMiddleware = uploadMiddleware;

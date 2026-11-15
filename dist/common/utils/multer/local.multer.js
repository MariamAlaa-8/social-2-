"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMulterUpload = exports.processFields = exports.processFiles = exports.processFile = exports.rollbackFiles = exports.localFileUpload = exports.fileValidation = void 0;
const multer_1 = __importDefault(require("multer"));
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const promises_1 = require("node:fs/promises");
const file_type_1 = require("file-type");
const exception_1 = require("../../exception");
const enum_1 = require("../../enum");
const node_os_1 = require("node:os");
exports.fileValidation = {
    Image: ['image/jpeg', 'image/png', 'image/gif'],
    files: ["application/pdf", "application/json"]
};
const localFileUpload = ({ maxFileSize = 5, storageApproach = enum_1.storageApproachEnum.MEMORY }) => {
    const storage = storageApproach === enum_1.storageApproachEnum.MEMORY ? multer_1.default.diskStorage({
        destination: async (req, file, cb) => {
            cb(null, (0, node_os_1.tmpdir)());
        }, filename: (req, file, cb) => {
            const uniqueFileName = `${(0, node_crypto_1.randomUUID)()}-${file.originalname}`;
            cb(null, uniqueFileName);
        }
    }) : multer_1.default.memoryStorage();
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: maxFileSize * 1024 * 1024 }
    });
};
exports.localFileUpload = localFileUpload;
const rollbackFiles = async ({ files = [] }) => {
    for (const file of files) {
        if (!file?.filepath)
            continue;
        try {
            await (0, promises_1.unlink)((0, node_path_1.resolve)(`./${file.filepath}`));
        }
        catch (error) {
            console.log(`Failed to rollback file: ${file.filepath}`);
        }
    }
};
exports.rollbackFiles = rollbackFiles;
const processFile = async ({ custompath = "general", file, validation = [] }) => {
    if (file.path) {
        file.buufer = await (0, promises_1.readFile)(file.path);
    }
    const result = await (0, file_type_1.fileTypeFromBuffer)(file.buffer);
    if (!result || !validation.includes(result.mime)) {
        await (0, promises_1.unlink)(file.path);
        throw new exception_1.BadException("Invalid file format");
    }
    await (0, promises_1.mkdir)((0, node_path_1.resolve)(`./assets/${custompath}`), { recursive: true });
    const uniqueFilePath = `assets/${custompath}/${(0, node_crypto_1.randomUUID)()}.${result.ext}`;
    await (0, promises_1.writeFile)((0, node_path_1.resolve)(`./${uniqueFilePath}`), file.buffer);
    if (file.path) {
        await (0, promises_1.unlink)(file.path);
    }
    file.filepath = uniqueFilePath;
    return file;
};
exports.processFile = processFile;
const processFiles = async ({ custompath = "general", files, validation }) => {
    const assets = [];
    try {
        for (const file of files) {
            const uploadedFile = await (0, exports.processFile)({ custompath, file, validation });
            assets.push(uploadedFile);
        }
        return assets;
    }
    catch (error) {
        await (0, exports.rollbackFiles)({ files: assets });
        throw error;
    }
};
exports.processFiles = processFiles;
const processFields = async ({ custompath = "general", fields, validation }) => {
    const assets = [];
    try {
        for (const field of Object.keys(fields)) {
            const files = await (0, exports.processFiles)({ custompath, files: fields[field], validation });
            assets.push({ field, files });
        }
        return assets;
    }
    catch (error) {
        const allFiles = assets.flatMap((a) => a.files);
        await (0, exports.rollbackFiles)({ files: allFiles });
        throw error;
    }
};
exports.processFields = processFields;
const processMulterUpload = async ({ req, custompath = "general", validation = [] }) => {
    if (req.file) {
        await (0, exports.processFile)({ custompath, file: req.file, validation });
    }
    else if (Array.isArray(req.files)) {
        await (0, exports.processFiles)({ custompath, files: req.files, validation });
    }
    else if (typeof req.files == "object" && req.files && Object.keys(req.files)?.length) {
        await (0, exports.processFields)({ custompath, fields: req.files, validation });
    }
};
exports.processMulterUpload = processMulterUpload;

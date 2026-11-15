import multer from "multer"
import { randomUUID } from 'node:crypto'
import { resolve } from "node:path"
import { mkdir, writeFile, unlink ,readFile} from "node:fs/promises"
import { fileTypeFromBuffer } from 'file-type'
import { BadException } from "../../exception"
import { Request } from "express"
import { storageApproachEnum } from "../../enum"
import { tmpdir } from "node:os"


export const fileValidation = {
    Image: ['image/jpeg', 'image/png', 'image/gif'],
    files: ["application/pdf", "application/json"]
}

export const localFileUpload = ({ maxFileSize = 5, storageApproach = storageApproachEnum.MEMORY }: { maxFileSize?: number, storageApproach?: storageApproachEnum }) => {

    const storage =storageApproach === storageApproachEnum.MEMORY ? multer.diskStorage({
        destination: async (req, file, cb) => {
          cb(null, tmpdir())
        },filename: (req, file, cb) => {
            const uniqueFileName = `${randomUUID()}-${file.originalname}`
            cb(null, uniqueFileName)
        }
    }) : multer.memoryStorage()
    return multer({
        storage,
        limits: { fileSize: maxFileSize * 1024 * 1024 }
    })
}

export const rollbackFiles = async ({ files = [] }: { files?: any[] }) => {
    for (const file of files) {
        if (!file?.filepath) continue
        try {
            await unlink(resolve(`./${file.filepath}`))
        } catch (error) {
            console.log(`Failed to rollback file: ${file.filepath}`)
        }
    }
}

export const processFile = async ({ custompath = "general", file, validation = [] }: { custompath?: string, file: any, validation?: string[] }) => {
       if(file.path){
    file.buufer = await readFile(file.path)
   }
    const result = await fileTypeFromBuffer(file.buffer)

    if (!result || !validation.includes(result.mime)) {
        await unlink(file.path)
        throw new BadException("Invalid file format")
    }

     await mkdir(resolve(`./assets/${custompath}`), { recursive: true })

     const uniqueFilePath = `assets/${custompath}/${randomUUID()}.${result.ext}`

     await writeFile(resolve(`./${uniqueFilePath}`), file.buffer)
    if(file.path){
        await unlink(file.path)
    }

     file.filepath = uniqueFilePath

    return file
}

export const processFiles = async ({ custompath = "general", files, validation }: { custompath?: string, files: Express.Multer.File[], validation: string[] }) => {
    const assets: any[] = []

    try {
        for (const file of files) {
            const uploadedFile = await processFile({ custompath, file, validation })
            assets.push(uploadedFile)
        }
        return assets
    } catch (error) {
        await rollbackFiles({ files: assets })
        throw error
    }
}

export const processFields = async ({ custompath = "general", fields, validation }: { custompath?: string, fields: Record<string, Express.Multer.File[]>, validation: string[] }) => {
    const assets: any[] = []

    try {
        for (const field of Object.keys(fields)) {
            const files = await processFiles({ custompath, files: fields[field] as Express.Multer.File[], validation })
            assets.push({ field, files })
        }
        return assets
    } catch (error) {
        const allFiles = assets.flatMap((a) => a.files)
        await rollbackFiles({ files: allFiles })
        throw error
    }
}

export const processMulterUpload = async ({ req, custompath = "general", validation = [] }: { req: Request, custompath?: string, validation?: string[] }) => {
    if (req.file) {
        await processFile({ custompath, file: req.file, validation })
    } 
 
    else if (Array.isArray(req.files)) {
        await processFiles({ custompath, files: req.files as Express.Multer.File[], validation })
    } 

    else if (typeof req.files == "object" && req.files && Object.keys(req.files)?.length) {
        await processFields({ custompath, fields: req.files as Record<string, Express.Multer.File[]>, validation })
    }
}
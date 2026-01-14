import multer from "multer";
import { createBucketClient } from "@cosmicjs/sdk";

const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env;

const bucketAvatares = createBucketClient({
    bucketSlug: BUCKET_AVATARES as string,
    writeKey: CHAVE_GRAVACAO_AVATARES as string
});

const bucketPublicacoes = createBucketClient({
    bucketSlug: BUCKET_PUBLICACOES as string,
    writeKey: CHAVE_GRAVACAO_PUBLICACOES as string
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') && 
            !req.file.originalname.includes('.jpeg')){
                throw new Error('Extensao da imagem invalida');
        } 

        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.media.insertOne({media : media_object});
        }else{
            return await bucketAvatares.media.insertOne({media : media_object});
        }
    }
}

export {upload, uploadImagemCosmic};
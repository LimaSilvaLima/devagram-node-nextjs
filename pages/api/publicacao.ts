import type { NextApiRequest, NextApiResponse } from "next";
import  type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { createRouter } from 'next-connect';
import {upload, uploadImagemCosmic  } from '../../services/uploadImagemCosmic';
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";



const handler = createRouter<NextApiRequest, NextApiResponse>()
    .use(upload.single('file') as any)
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        const {descricao, file} = req.body;

        if(!descricao || descricao.length < 5){
            return res.status(400).json({erro: 'Descricao invalida'});
        }

        if(!file || file.length === 0){
            return res.status(400).json({erro: 'Imagem obrigatoria'});
        }

        return res.status(200).json({msg: 'Publicacao criada com sucesso'});
});

export const config = {
    api: {
        bodyParser: false
    }
}

export default validarTokenJWT(conectarMongoDB(handler.handler()));

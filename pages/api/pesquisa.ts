import type { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { createRouter } from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";

const pesquisaEndpoint = (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        
    } catch (e) {
       console.log(e);
       return res.status(500).json({erro: "nao foi possível encontrar usuário" + e}); 
    }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
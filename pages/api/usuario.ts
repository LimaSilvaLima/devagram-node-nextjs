import type { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    return res.status(200).json({ msg: 'Usuario autenticado com sucesso' });
    //res.status(200).json({ msg: 'Usuario autenticado com sucesso', userId: req.query.userId?.toString() || '' });
}

export default conectarMongoDB(validarTokenJWT(usuarioEndpoint));
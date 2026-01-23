import type { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { createRouter } from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";

const pesquisaEndpoint
    = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>  | any []) => {
    try {
        if(req.method === 'GET') {
            const {filtro} = req.query;
            if(!filtro || filtro.length < 5) {
                return res.status(400).json({msg: 'Favor informar o filtro da pesquisa com no minimo 5  caracteres'});
            } 
            const usuariosEncontrados = await UsuarioModel.find({
                $or :[{nome:  {$regex: filtro, $options: 'i'}},
                {email:  {$regex: filtro, $options: 'i'}}]
            });
            return res.status(200).json(usuariosEncontrados);
        }
        return res.status(405).json({msg: 'Metodo informado nao e valido'});
    } catch (e) {
       console.log(e);
       return res.status(500).json({erro: "nao foi possível encontrar usuário" + e}); 
    }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
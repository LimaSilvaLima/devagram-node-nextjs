import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { createRouter } from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { publicacaoModel } from "../../models/PublicacaoModels";
import { UsuarioModel } from "../../models/UsuarioModel";

const likeEndpoint
    = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        if(req.method === 'PUT') {
           const {id} = req?.query; 
           const publicacao = await publicacaoModel.findById(id);
           if(!publicacao) {
            return res.status(400).json({msg: 'Publicacao nao encontrada'});
           }
           const {userId} = req?.query;
           const usuario = await UsuarioModel.findById(userId);
           if(!usuario) {
            return res.status(400).json({msg: 'Usuario nao encontrado'});
           }
           if(!publicacao.likes) {

           }
           const  indexDoUsuarioNoLike  = publicacao.likes.findIndex((e: any) => e.toString() === usuario._id.toString());
           if(indexDoUsuarioNoLike != -1) {
            publicacao.likes.splice(indexDoUsuarioNoLike, 1);
            await publicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
            return res.status(200).json({msg: 'Like removido com sucesso'});
           } else {
            publicacao.likes.push(usuario._id);
            await publicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
            return res.status(200).json({msg: 'Like adicionado com sucesso'});
           }
        }
        return res.status(405).json({msg: 'Metodo informado nao e valido'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro ao processar o like" });
    }
}

export default validarTokenJWT(conectarMongoDB(likeEndpoint));
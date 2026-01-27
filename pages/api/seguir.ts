import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { createRouter } from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { publicacaoModel } from "../../models/PublicacaoModels";
import { UsuarioModel } from "../../models/UsuarioModel";
import { seguidorModel as SeguidorModel } from "../../models/SeguidorModel";
import { politicaCORS } from '../../middlewares/politicaCORS';

const endpointSeguir
    = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
           if(req.method === 'PUT') {
             const {userId, id} = req?.query;                 
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro: 'Usuario logado nao encontrado'});
            }
            const usuarioASerSeguido = await UsuarioModel.findById(id);
           if(!usuarioASerSeguido){
            return res.status(400).json({erro: 'Usuario a ser seguido nao encontrado'});
           }
           const euJaSigoEsseUsuario = await SeguidorModel
             .find({usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});
              if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                // Remove todos os registros de seguidor encontrados de uma vez
                await SeguidorModel.deleteMany({usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});
                // Atualiza os contadores de forma atômica usando $inc
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, { $inc: { seguindo: -1 } });
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, { $inc: { seguidores: -1 } });
                return res.status(200).json({msg: 'Voce deixou de seguir esse usuario'});
              }else{
                const seguidor = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguidoId : usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);
                // Atualiza os contadores de forma atômica usando $inc
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, { $inc: { seguindo: 1 } });
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, { $inc: { seguidores: 1 } });
                return res.status(200).json({msg: `Voce esta seguindo o usuario ${usuarioASerSeguido.nome}`});
              }
            
           }  else {
            return res.status(405).json({erro: 'Metodo informado nao e valido'});
           }
           
           
           

        } catch (e) {
            console.log(e);
            return res.status(500).json({ erro: "Erro ao processar a requisicao de seguir/desseguir" });  
        }
    }

    export default politicaCORS(validarTokenJWT(conectarMongoDB(endpointSeguir)));
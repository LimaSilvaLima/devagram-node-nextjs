import type { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { createRouter } from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { politicaCORS } from '../../middlewares/politicaCORS';

const handler = createRouter<NextApiRequest, NextApiResponse>()
    .put(upload.single('file') as any, async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
           const { userId } = req.query;
           const usuario = await UsuarioModel.findById(userId);
           if (!usuario) {
               return res.status(400).json({ msg: 'Usuario nao encontrado' });
           }
           const { nome } = req.body; 
              if (nome && nome.length > 5) {
                  usuario.nome = nome;
              }

            const {file} = req;
            if (file && file.originalname) {
                const image = await uploadImagemCosmic(req);
                if (image && image.media && image.media.url) {
                    usuario.avatar = image.media.url;
                }
            }

            await UsuarioModel
                .findByIdAndUpdate({ _id: usuario._id }, usuario);
            return res.status(200).json({ msg: 'Usuario atualizado com sucesso' });

        } catch (e) {
            console.log(e);
        }
         return res.status(500).json({ msg: 'Erro ao atualizar usuario' });
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
      const {userId} = req.query;  
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
          return res.status(400).json({ msg: 'Usuario nao encontrado' });
      }
      usuario.senha = null;
      return res.status(200).json(usuario);
    } catch (e) {
        console.log(e);
    }
     return res.status(500).json({ msg: 'Erro ao buscar usuario'  });
});

export const config = {
    api: {
        bodyParser: false
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler.handler()))); 
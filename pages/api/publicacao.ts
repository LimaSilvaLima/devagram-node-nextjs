import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { createRouter } from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { publicacaoModel } from "../../models/PublicacaoModels";
import { UsuarioModel } from "../../models/UsuarioModel";

const handler = createRouter<NextApiRequest, NextApiResponse>()
    .use(upload.single('file') as any)
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
       
       try {
            const { userId } = req.query;
            const { descricao } = req.body;
            
            if (!req || !req.body) {
                return res.status(400).json({ erro: 'Parametros de entrada invalidos' });
            }

            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ erro: 'Descricao invalida' });
            }

            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ erro: 'Imagem obrigatoria' });
            }

            const usuario = await UsuarioModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuario nao encontrado' });
            }

            const imagem = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: imagem?.media?.url,
                data: new Date()
            };
            await publicacaoModel.create(publicacao);

            return res.status(200).json({ msg: 'Publicacao criada com sucesso' });
       } catch (e) {
            return res.status(500).json({ erro: 'Erro ao cadastrar publicacao: ' + e });
       }
});

export const config = {
    api: {
        bodyParser: false
    }
}

export default conectarMongoDB(validarTokenJWT(handler.handler()));

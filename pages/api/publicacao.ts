import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { createRouter } from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";

const handler = createRouter<NextApiRequest, NextApiResponse>()
    .use(upload.single('file') as any)
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
       
       try {

            if (!req || !req.body) {
                return res.status(400).json({ erro: 'Parametros de entrada invalidos' });
            }
            const { descricao } = req.body;

            if (!descricao || descricao.length < 5) {
                return res.status(400).json({ erro: 'Descricao invalida' });
            }

            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ erro: 'Imagem obrigatoria' });
            }

            await uploadImagemCosmic(req);
            // Aqui você deve adicionar a lógica para salvar a publicação no MongoDB

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

export default validarTokenJWT(conectarMongoDB(handler.handler()));

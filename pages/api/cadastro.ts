import type { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from "../../models/UsuarioModel";
import md5 from 'md5';
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { createRouter } from "next-connect";


const handler = createRouter<NextApiRequest, NextApiResponse>()
    .use(upload.single('file') as any)
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {
            const usuario = req.body as CadastroRequisicao;
        if(!usuario.nome || usuario.nome.length <  5){
            return res.status(400).json({erro : 'nome invalido'});
        }
        if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')){ 
            return res.status(400).json({erro : 'email invalido'});
        }
        if(!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({erro : 'senha invalida'});
        }

        const usuarioComMesmoEmail = await UsuarioModel.findOne({email : usuario.email});
        if(usuarioComMesmoEmail){
            return res.status(400).json({erro : 'ja existe uma conta com esse email'});

        }
        
        // enviar a imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req);
    
        // salvar no banco de dados
        const usuarioASerSalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha),
            avatar : image?.media?.url
        }
        await UsuarioModel.create(usuarioASerSalvo);
        return res.status(200).json({msg: 'Usuario cadastrado com sucesso'});
            
        } catch (e: any ) {
            console.log(e);
            return res.status(400).json({erro : e.toString()});
            
        }

    });

    export const config ={
        api : {
            bodyParser : false
        }
    }
    

export default conectarMongoDB(handler.handler());
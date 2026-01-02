import type { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';

const endpointCadastro = (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
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
        return res.status(200).json({msg: 'Usuario cadastrado com sucesso'});
        
    }
    return res.status(405).json({erro: 'Method not allowed'});

}

export default conectarMongoDB(endpointCadastro);
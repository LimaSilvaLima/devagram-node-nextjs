import type {NextApiRequest, NextApiResponse} from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel';
import jwt from 'jsonwebtoken';
import { LoginResposta } from '../../types/LoginResposta';
import { politicaCORS } from '../../middlewares/politicaCORS';



const endpointLogin = async(
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | LoginResposta>    
) => {

        //const token = jwt.sign({email: login}, process.env.MINHA_CHAVE_JWT, {expiresIn: '1d'});
    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro: 'Env variable MINHA_CHAVE_JWT is not defined'});
    }
    
    if(req.method === 'POST'){
        const {login, senha} = req.body;
        const usuarioEncontrado = await UsuarioModel.findOne({email : login, senha : md5(senha)});

        if(usuarioEncontrado){
            
            const token = jwt.sign({_id: usuarioEncontrado._id}, MINHA_CHAVE_JWT);
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token });

            //return res.status(200).json({msg: `Usuario logado com sucesso : ${usuarioEncontrado.nome}`});
        }

       return res.status(400).json({erro: 'User not found'});
    }
    return res.status(405).json({erro: 'Method not allowed'});
};

export default politicaCORS(conectarMongoDB(endpointLogin));
//export default endpointLogin;
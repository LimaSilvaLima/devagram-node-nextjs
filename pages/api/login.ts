import type {NextApiRequest, NextApiResponse} from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';



const endpointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;
        const { ADMIN_LOGIN, ADMIN_SENHA } = process.env;

        if(login === ADMIN_LOGIN && senha === ADMIN_SENHA){
            return res.status(200).json({msg: 'Login realizado com sucesso'});
        }
        return res.status(400).json({erro: 'User not found'});
    }
    return res.status(405).json({erro: 'Method not allowed'});
};

export default conectarMongoDB(endpointLogin);
//export default endpointLogin;
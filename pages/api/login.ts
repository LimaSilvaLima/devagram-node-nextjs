import type {NextApiRequest, NextApiResponse} from 'next'

export default(
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body
        if(login === 'admin@admin.com' && senha === 'admin@123'){
            return res.status(200).json({message: 'Login realizado com sucesso'});
        }
        return res.status(400).json({error: 'User not found'});
    }
    return res.status(405).json({error: 'Method not allowed'});
    
};
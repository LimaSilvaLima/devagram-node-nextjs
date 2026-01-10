import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";
import jwt , { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    try {
        const { MINHA_CHAVE_JWT } = process.env;

        if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ erro: 'Env variable MINHA_CHAVE_JWT is not defined' });
        }

        if(!req || !req.headers){
            return res.status(401).json({ erro: 'Nao autorizado' });
        }

        if(req.method !== 'OPTIONS'){
        const authorization = req.headers['authorization'];

        if(!authorization){
            return res.status(401).json({ erro: 'Nao autorizado' });
        }
        const token= authorization.split(' ')[1];
        if(!token || token.length < 10){
            return res.status(401).json({ erro: 'Nao autorizado' });
        }

        const decoded = await jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
        if(!decoded){
            return res.status(401).json({ erro: 'Nao autorizado' });
        }

        if(!req.query){
            req.query = {};
        }

        req.query.userId = decoded._id;

        }

        
        } catch (error) {
        console.log(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ erro: 'Token inválido ou mal formatado' });
        }
        return res.status(500).json({ erro: 'Erro ao validar o token de acesso' }); 
        }
        

    return handler(req, res);
  }
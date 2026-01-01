import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';


export const conectarMongoDB = (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    if (mongoose.connections[0].readyState) {                                  
      return handler(req, res);
    }
    //Se nao, obter a variavel de ambiente no rnv e conectar
    const { DB_CONEXAO_STRING  } = process.env;

    if (!DB_CONEXAO_STRING) {
      return res.status(500).json({ erro: 'ENV de string de conexao nao informada' });
    }
  
    mongoose.connection.on('connected', () => console.log('Conectado ao MongoDB'));
    mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar ao MongoDB: ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);
    //seguit pro endpoint
    return handler(req, res);

}
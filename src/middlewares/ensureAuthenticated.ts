import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import AppError from '../errors/AppError';
import authConfig from '../config/auth';


interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {

  /**
   * []validação do token Jwt
   * [] pegar o token que vem pelo header da requisião, 
   *    nome do header: authorization
   */

  const authHeader = request.headers.authorization;

  // se o token não exisitr no header. authorization, dispara um error
  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  //o token do type "Bearer" e "token", separ o Bearer do token
  //const token = authHeader.split(' ');

  //desestruturar o Bearer do token
  //const [type, token] = authHeader.split(' '); //usar só a segunda posição do array

  const [, token] = authHeader.split(' '); //usar só a segunda posição do array

  //verificar se o token é válido com o metodo "verify" da lib jwt
  try { //tratar erro caso o metodo verify não valide o token
    const decoded = verify(token, authConfig.jwt.secret); //o segundo paramentro é a chave secret
    console.log(decoded);

    //pegar o id do usuário autenticado
    //qualquer rota que usar o middleware, terá acesso ao id do usário
    const { sub } = decoded as TokenPayload; //TokenPlayload, hacker para mudar o type da variável

    request.user = { //não reconheceu o user, será necessário criar um haker para o express reconhecer o "user"
      id: sub
    }


    return next();

  } catch (err) {
    throw new AppError('Invalid JWT token', 401); //disparar msg de erro no formato desejado, personalizada
  }



}
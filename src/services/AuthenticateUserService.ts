import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'


import authConfig from '../config/auth';
import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    //user.password - senha criptografada do usuário no BD
    //password - senha não criptografa passada pelo usuário(front-end)
    //comparar se a password(usuário-front-end) é igual a user.password(BD) com
    // o método "compare" do "bcriptjs"
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    //desestruturar "authConfig.jwt", retirar as variaveis de dentro do authConfig
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    })

    //retornar usuário autenticado
    return {
      user,
      token,
    };
  }

}

export default AuthenticateUserService;
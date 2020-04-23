import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs'

import User from '../models/user';

interface Request {
  email: string;
  password: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<{ user: User }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    //user.password - senha criptografada do usuário no BD
    //password - senha não criptografa passada pelo usuário(front-end)
    //comparar se a password(usuário-front-end) é igual a user.password(BD) com
    // o método "compare" do "bcriptjs"
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination.');
    }

    //retornar usuário autenticado
    return {
      user,
    };
  }

}

export default AuthenticateUserService;
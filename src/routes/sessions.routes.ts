import { Router, request } from 'express';

import AppError from '../errors/AppError';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const autheticateUser = new AuthenticateUserService();

  const { user, token } = await autheticateUser.execute({
    email,
    password
  });

  //excluir o campo de password, não é recomendado retornar para usuário
  delete user.password;

  return response.json({ user, token });

});

export default sessionsRouter;
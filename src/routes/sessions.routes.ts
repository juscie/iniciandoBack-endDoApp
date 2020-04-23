import { Router, request } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const autheticateUser = new AuthenticateUserService();

    const { user } = await autheticateUser.execute({
      email,
      password
    });

    //excluir o campo de password, não é recomendado retornar para usuário
    delete user.password;

    return response.json({ user });

  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
});

export default sessionsRouter;
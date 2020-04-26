import { Router, request } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UdateUserAvatarService from '../services/UpdateUserAvatarService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { tr } from 'date-fns/locale';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';



const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();


    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password; //retira a senha do "user" para não ser retornada
    return response.json(user);

  } catch (err) {

  }
});

//o uplad.single() é um middleware, nele para o nome campo, pode ser qualquer nome
usersRouter.patch('/avatar', ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      //console.log(request.file);
      const updateUserAvatar = new UpdateUserAvatarService();

      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      delete user.password;

      return response.json(user);

    } catch (err) {
      return response.status(400).json({ error: err.message })
    }


  },
);

export default usersRouter;
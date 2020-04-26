import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database';


const app = express();

app.use(express.json());

//visualizar o arquivo da pasta, arquivo estático
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

//1 -tratativas de erros sempre após as rotas
//2 - é um middleware / porém com quatro paramentros
//3 - Importar os tipos da variaveis no express, request, response e next
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error, 500',
  })
});








app.listen(3333, () => {
  console.log('Server started on port 3333');
});

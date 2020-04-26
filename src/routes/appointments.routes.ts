import { Router, request } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../respositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';



const appointmentsRouter = Router();

//aplicar o middleware em todas as rotas
appointmentsRouter.use(ensureAuthenticated);

//SoC: Separation of Concerns (Separação de preocupações)
//DTO - Data Transfer Object (transferir dados de um arquivo para outro, "transferir dados em objeto")
// Rota: Receber a requisção, chamar outro arquivo, devolver uma resposta
appointmentsRouter.get('/', async (request, response) => {
  /***
   * pegar o id do usário é importante para poder pegar dados do usuário
   * limitar o que ele pode ter acesso
   */
  console.log(request.user); //id do usuário vindo do middleware
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});

/**
 * o index encaminha a requisição da rota para appointmentsRouter
 * pois ele tem o arquivo de rotas importado com esse nome
 *
 */

//aplicar middleware em rota especifica é adicionar no paramentro do método
appointmentsRouter.post('/', async (request, response) => {

  const { provider_id, date } = request.body;

  //const parsedDate = startOfHour(parseISO(date));
  //separar o código a cima
  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);

});

export default appointmentsRouter;

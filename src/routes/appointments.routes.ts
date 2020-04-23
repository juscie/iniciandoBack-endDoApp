import { Router, request } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../respositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
const appointmentsRouter = Router();

//SoC: Separation of Concerns (Separação de preocupações)
//DTO - Data Transfer Object (transferir dados de um arquivo para outro, "transferir dados em objeto")
// Rota: Receber a requisção, chamar outro arquivo, devolver uma resposta
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});

/**
 * o index encaminha a requisição da rota para appointmentsRouter
 * pois ele tem o arquivo de rotas importado com esse nome
 *
 */

appointmentsRouter.post('/', async (request, response) => {
  try {
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
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
});

export default appointmentsRouter;

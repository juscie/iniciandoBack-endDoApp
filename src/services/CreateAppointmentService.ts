import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../respositories/AppointmentsRepository';

/**
 * Recebimento das informçoes
 * Tratativa de erros/excessões
 * Acesso ao repositório
 */

/***
 * Dependency Inversion , encontrar esse princípio dentro do (SOLID)
 */
interface Request {
  provider_id: string;
  date: Date;
}

/**
 * DRY: Don´t repeat Yourself
 */

class CrateAppointmentService {


  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);


    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    };

    //obs: o create não cria no banco de dados, cria apenas uma estância
    //para salvar no BD é preciso usar o "save" do repositório para savar no BD

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // o "seve()", se já existir, le altera
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}
export default CrateAppointmentService;
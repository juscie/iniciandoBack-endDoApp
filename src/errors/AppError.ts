class AppError {

  //public para ser acessado todos os arquivos
  public readonly message: string;

  //readonly, não consegue acessar desta forma: error.message
  public readonly statusCode: number; // é os códigos de erro, 401, 404, 500...

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }

}

export default AppError;
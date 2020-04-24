//criar hack de typos da lib (express) no caso, 
//pôr no nome do aquivo, o "nome" da lib e "t" e a extensão "ts" 
declare namespace Express { //sobre-escrever o nome de um type da lib "express"
  export interface Request {
    user: {
      id: string;
    };
  }
}
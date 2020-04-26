import path from 'path'; //trabalhar com caminhos de pastas
import crypto from 'crypto'; //lib do node para gerar hach
import multer from 'multer'; //lib para upload de arquivos


const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {

  directory: tmpFolder,

  storage: multer.diskStorage({
    //local onde será armazenados os arquivos de upload
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    }
  }),
};

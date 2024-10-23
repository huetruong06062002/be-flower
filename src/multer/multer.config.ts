import { diskStorage } from 'multer';
import * as path from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './public/flower', // Thư mục lưu ảnh
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname); // Lấy phần mở rộng của file
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Tạo tên file mới với timestamp
    },
  }),
};

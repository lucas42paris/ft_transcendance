import { UnauthorizedException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const MulterConfig = {
	fileFilter: (req, file, callback) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return callback(new UnauthorizedException('Only .jpg, .jpeg and .png extensions are allowed'), false);
		 }
		 callback(null, true);
	},
	dest: './public',
	storage: diskStorage({
	  destination: '../front/public/avatar/',
	  filename: (req, file, callback) => {
		const filename = req.user.id + '.png';
		callback(null, filename);
	  },
	}),
}

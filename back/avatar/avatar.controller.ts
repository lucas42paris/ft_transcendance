import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { appendFileSync } from 'fs';
import * as fs from 'fs';

@Controller('images')
export class ImagesController
{
  @Get(':imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response)
  {
	const imagePath = join('/front/public/avatar', imageName);
	
	try
	{
		if (fs.existsSync(imagePath))
			res.sendFile(imagePath);
	}
	catch (error)
	{
		const logFilePath = join(__dirname, 'error.log');
		appendFileSync(logFilePath, `${new Date().toISOString()} - Error: ${error.message}\n`);
	}
  }
}
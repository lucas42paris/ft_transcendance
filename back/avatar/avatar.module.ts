import { Module } from '@nestjs/common';
import { ImagesController } from './avatar.controller';

@Module({
  controllers: [ImagesController],
})
export class AvatarModule {}

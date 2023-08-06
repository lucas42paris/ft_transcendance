import { Module } from '@nestjs/common';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
// import { AuthService } from 'auth/auth.service';
// import { ConfigService } from '@nestjs/config';
// import { HttpModule } from '@nestjs/axios';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PongController],
  providers: [PongService],
//   exports: [PongService], 
//   imports: [],
})
export class PongModule {}

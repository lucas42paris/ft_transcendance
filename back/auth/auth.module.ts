import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { UserModule } from "user/user.module";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { IntraStrategy } from "./strategy/intra.strategy";

@Module({
	imports: [JwtModule.register({}),
		UserModule,
		HttpModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		ConfigService,
		IntraStrategy,
	],
})
export class AuthModule {}

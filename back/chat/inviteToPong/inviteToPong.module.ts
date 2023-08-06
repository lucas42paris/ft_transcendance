import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma_module/prisma.service";
import { InviteToPongService } from "./inviteToPong.service";
import { InviteToPongGateway } from "./inviteToPong.gateway";

@Module(
{
	providers: [InviteToPongGateway, InviteToPongService, PrismaService],
	exports: [InviteToPongService],
})

export class InviteToPongModule {}

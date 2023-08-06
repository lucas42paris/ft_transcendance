import { Module } from "@nestjs/common";
import { DirectMessageService } from "../directMessage/directMessage.service";
import { PrismaService } from "../../prisma_module/prisma.service";
import { DirectMessageGateway } from "./directMessage.gateway";

@Module(
{
	providers: [DirectMessageGateway, DirectMessageService, PrismaService],
	exports: [DirectMessageService],
})

export class DirectMessageModule {}

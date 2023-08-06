import { Module } from "@nestjs/common";
import { ChannelsGateway } from "./channels.gateway";
import { PrismaService } from "prisma_module/prisma.service";
import { ChannelsService } from "./channels.service";

@Module(
{
	providers: [ChannelsGateway, ChannelsService ,PrismaService],
	exports: [ChannelsService],
})
	
export class ChannelsModule {}

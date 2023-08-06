import { Module } from "@nestjs/common";
import { BlockageGateway } from "./blockage.gateway";
import { BlockageService } from "./blockage.service";
import { PrismaService } from "../../prisma_module/prisma.service";

@Module(
{
	providers: [BlockageGateway, BlockageService, PrismaService]
})

export class BlockageModule {}

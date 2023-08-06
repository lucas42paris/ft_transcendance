import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma_module/prisma.service";
import { FriendsGateway } from "./friends.gateway";
import { FriendsService } from "./friends.service";

@Module(
{
	providers: [FriendsGateway, FriendsService , PrismaService],
	exports: [FriendsService],
})

export class FriendsModule {}

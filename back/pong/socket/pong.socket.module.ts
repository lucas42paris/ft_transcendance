import { Module } from "@nestjs/common";
import { SocketEvents } from "./pong.socket.events"
import { DirectMessageModule } from "../../chat/directMessage/directMessage.module";

@Module({
    providers: [SocketEvents],
    imports: [DirectMessageModule],
})
export class SocketModule {}
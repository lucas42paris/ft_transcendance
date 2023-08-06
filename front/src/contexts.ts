import { createContext } from "react";
import { Socket } from "socket.io-client";
import { Message } from "./scenes/Chat/ChatBox/ChatBox";
import { ChanMessage } from "./scenes/Chat/ChannelBox/ChannelBox";
import { ChanUser, ChannelToUser, SideProfileContextValue } from "./scenes/Chat/MainPage/MainPage";

export const SocketContext = createContext<Socket | null>(null);
export const MessageContext = createContext<Message[]>([]);
export const ChanMessageContext = createContext<ChanMessage[]>([]);
export const ChanToUserContext = createContext<ChannelToUser[]>([]);

export interface ChanUsersContextValue {
	allUsers: ChanUser[];
	setChannelUsers: React.Dispatch<React.SetStateAction<ChanUser[]>>;
  }
  
  export const ChanUsersContext = createContext<ChanUsersContextValue>({
	allUsers: [],
	setChannelUsers: () => {},
  });

export const SideProfileContext = createContext<SideProfileContextValue>({
	user: null,
	onClose: () => {},
	currentUser: null,
	activeChannel: null,
});
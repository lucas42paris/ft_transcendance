import { useContext, useEffect, useRef } from "react";
import { MessageContext} from "../../../contexts";
import "./ChatBox.css";

export interface Message
{
	senderId: number;
	receiverId: number;
	content: string;
}

const ChatBox = ({senderId, receiverId}: {senderId: number, receiverId: number}) =>
{
	const allMessages = useContext(MessageContext);
	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	const messages = allMessages.filter(msg =>
		(msg.senderId === senderId && msg.receiverId === receiverId) ||
		(msg.senderId === receiverId && msg.receiverId === senderId)
	);

	const scrollToBottom = () =>
	{
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
	}

	useEffect(() =>
	{
		scrollToBottom()
	}, [messages]);

	return (
	<div className="chat-box">
		{messages.map((message, i) =>
			<div key={i} className={`message-container`}>
				<div className={`message ${message.senderId === senderId ? 'sent' : 'received'}`}>
					{message.content}
				</div>
			</div>
		)}
		<div ref={messagesEndRef} />
	</div>
	);
}

export default ChatBox;

import React, { useState } from 'react';
import { useContext } from "react";
import { SocketContext } from "../../../contexts";
import './ChannelForm.css';

type Props =
{
	senderId: number;
	channelId: number;
};

const ChannelForm: React.FC<Props> = ({senderId, channelId}) =>
{

	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const socket = useContext(SocketContext);

	const validateForm = () =>
	{
		if (senderId <= 0)
		{
			setError('Invalid user IDs');
			return false;
		}
		if (channelId === -2) {
			setError('You are muted');
			return false;
		}
		return (true);
	};

	const emitSocketEvent = () =>
	{
		if (!socket)
			return;
		socket.emit('channelMessage', { senderId: senderId, channelId: channelId, message: message });
		setMessage('');
	};

	const handleSubmit = (e: React.FormEvent) =>
	{
		e.preventDefault();

		if (validateForm())
			emitSocketEvent();
	};

	return (
		<form className="private-message-form-wrapper" onSubmit={handleSubmit}>
			{error && <p className="error-message">{error}</p>}
		  	<input
				type="text"
				placeholder="Message"
				maxLength={4096}
				className="message-input"
				value={message}
				onChange={e => {setError(''); setMessage(e.target.value)}}
		  	/>
		</form>
	  );
};

export default ChannelForm;

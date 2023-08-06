import React, { useState } from 'react';
import { useContext } from "react";
import { SocketContext } from "../../../contexts";
import './DirectMessageForm.css';

type Props =
{
	senderId: number;
	receiverId: number;
};

const DirectMessageForm: React.FC<Props> = ({senderId, receiverId}) =>
{
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const socket = useContext(SocketContext);

	const validateForm = () =>
	{
		if (senderId <= 0 || receiverId <= 0)
		{
			setError('Invalid user IDs');
			return (false);
		}

		return (true);
	};

	const emitSocketEvent = () =>
	{
		if (senderId === receiverId)
		{
			setError("Error: You can't dm yourself !");
			return;
		}

		setError('');

		if (socket)
			socket.emit('privateMessage', {senderId, receiverId, content: message});
		else
			console.log('Socket is not available!');

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

export default DirectMessageForm;
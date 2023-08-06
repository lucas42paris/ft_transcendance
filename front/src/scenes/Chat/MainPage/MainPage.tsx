import { useContext, useState, useRef, createContext, useEffect, useCallback } from 'react';
import Header from "../../../components/header"
import { ChanToUserContext, SideProfileContext, SocketContext } from '../../../contexts';
import UsersList from "../UsersList/UsersList";
import DirectMessageForm from "../DirectMessageForm/DirectMessageForm";
import './MainPage.css';
import ChannelBox from '../ChannelBox/ChannelBox';
import ChannelForm from '../ChannelForm/ChannelForm';
import SideProfile from '../SideProfile/SideProfile';
import ChatBox from '../ChatBox/ChatBox';
import Sidebar from '../Sidebar/Sidebar';
import { ChanUsersContext } from "../../../contexts";


export interface ChannelToUser {
    userId: number;
	isAdmin: boolean;
	isMuted: boolean;
	isBanned: boolean;
    channelId: string;
}

export interface ChanUser {
	id: number;
	name: string;
	administratedChannels: ChannelToUser[];
	ownedChannels: Channel[];
}

export interface SideProfileContextValue {
	user: ChanUser | null;
	onClose: () => void;
	currentUser: any;
	activeChannel: Channel | null;
}

interface ButtonChannelContextValue {
	displayPopup: () => void;
	channels: Channel[];
	activeChannel: Channel | null;
	handleJoinChannel: (channel: Channel) => void;
  }

export interface Channel {
	id: string;
	name: string;
	ispassword: boolean;
	password: string;
	ownerId: string;
}

export const buttonChannelContext = createContext<ButtonChannelContextValue>({
	displayPopup: () => {},
	channels: [],
	activeChannel:null,
	handleJoinChannel: () => {},
});

const ChatPage = () =>
{
    const [currentUser, setCurrentUser] = useState<any>(null);
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
	const [activeUser, setActiveUser] = useState<ChanUser | null>(null);
	const [privateMessageUserId, setPrivateMessageUserId] = useState<number | null>(null);
	const [statepopup, ChangeStatePopup] = useState(false);
	const [options, setOptions] = useState(false);
	const createInputRef = useRef<HTMLInputElement>(null);
	const [channel, setChannel] = useState('');
	const [channels, setChannels] = useState<{id: string, name: string, ispassword: boolean, password: string, ownerId: string}[]>([]);
	const socket = useContext(SocketContext);
	const [activeView, setActiveView] = useState<'PRIVATE' | 'CHANNEL' | null>(null);
	const [passwordEnabled, setPasswordEnabled] = useState(false);
	const [password, setPassword] = useState('');
	const [showPasswordPopup, setShowPasswordPopup] = useState(false);
	const [channelToJoin, setChannelToJoin] = useState<Channel | null>(null);
	const [enteredPassword, setEnteredPassword] = useState('');
	const [isPasswordIncorrect, setPasswordIncorrect] = useState(false);
	const [showUsersPopup, setShowUsersPopup] = useState(false);
	const [showInputpassword, setShowInputpassword] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const { allUsers, setChannelUsers } = useContext(ChanUsersContext);
	const allrelations = useContext(ChanToUserContext);

	const kick = useCallback((userId: string) => {
		const userFromAllUsers = allUsers.find(user => user.id === currentUser.id);
		if (userFromAllUsers?.id === parseInt(userId))
			setActiveChannel(null);
	}, [allUsers, currentUser] );

	const handleLeaveChannel = async () => {
		if (socket && activeChannel && currentUser) {
		  socket.emit('leaveRoom', {channelId: activeChannel.id, userId: currentUser.id.toString()});
		  setActiveChannel(null);
		}
	  };

	
	const handleActiveUserChange = () => {
		setActiveUser(null);
	};

	const toggleOptionsPopup = () => {
		const currentuserFromAllUsers = allUsers.find(user => user.id === currentUser.id);
		if (currentuserFromAllUsers && activeChannel && currentuserFromAllUsers.ownedChannels.some(channel => channel.id === activeChannel.id))
			setIsOwner(true);
		setOptions(!options);
	}

	const toggleUsersPopup = () => {
		setShowUsersPopup(!showUsersPopup);
	};
	
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	}

	const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEnteredPassword(event.target.value);
	};

	const handleIfPasswordTrue = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const key = event.key;
		if ( enteredPassword.length > 0  && key === 'Enter') {
			event.preventDefault();
			if (socket && channelToJoin) {
				socket.emit('joinRoom', { channelId: channelToJoin.id, userId: currentUser.id ,password: enteredPassword });
			}
			setEnteredPassword('');
		}
	}

	const handleNewPassword = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const key = event.key;
		if ( enteredPassword.length > 0  && key === 'Enter') {
			event.preventDefault();
			if (socket && activeChannel) {
				socket.emit('setPassword', { channelId: activeChannel.id, password: enteredPassword });
			}
			setEnteredPassword('');
			setShowInputpassword(false);
		}
	}

	const unsetPassword = () => {
		if (socket && activeChannel) {
			socket.emit('setPassword', {channelId: activeChannel.id, password: null});
		}
	}

	const handleJoinChannel = (channel: Channel) => {
		if (activeChannel && allrelations.find(relation => relation.userId === currentUser.id && relation.channelId === activeChannel.id)) {
			const currentrelation = allrelations.find(relation => relation.userId === currentUser.id && relation.channelId === activeChannel.id);
			if (currentrelation && currentrelation.isBanned)
				return;
		}
		else if (channel.ispassword) {
			setChannelToJoin(channel);
			setPasswordIncorrect(false);
			setShowPasswordPopup(true);
		} else {
			setChannelToJoin(null);
			joinChannel(channel);
		}
	  };


	const joinChannel = (channel: Channel) => {
		if(socket && currentUser && currentUser.id && channel && channel.id) {
			setActiveView('CHANNEL');
			setActiveChannel(channel);
			socket.emit('joinRoom', {channelId: channel.id, userId: currentUser.id});
			socket.emit('getChannelConversation', {channelId: channel.id});
			socket.emit('getChannelUsers', { channelId: channel.id });
		}
	};

	const displayPopup = () => {
		ChangeStatePopup(!statepopup);
	}

	const handleChange = () => {
		if (createInputRef.current) {
			const value = createInputRef.current.value;
			setChannel(value);
		}
	};


	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		const key = event.key;
		const letters = /^[A-Za-z]+$/;

		if (createInputRef.current && createInputRef.current.value.length >= 20 && key !== 'Backspace' && key !== 'Delete' && key !== 'Enter') {
			event.preventDefault();
		} else if (!letters.test(key)) {
		  event.preventDefault();
		} else if (createInputRef.current && createInputRef.current.value.length > 0  && key === 'Enter' && !passwordEnabled) {
			event.preventDefault();
			const newChannelName = createInputRef.current.value;
			if (socket) {
				socket.emit('createChannel', {
					name: newChannelName,
					userId: currentUser.id,
					ispassword: passwordEnabled,
					password: password,
				});
			}
			displayPopup();
			setChannel('');
		}
	};
	
	const handleCreateChannelClick = () => {
		if (createInputRef.current && (createInputRef.current.value.length === 0 || password.length === 0))
			return;
		if (createInputRef.current && createInputRef.current.value.length > 0) {
			displayPopup();
			const newChannelName = createInputRef.current.value;
			if (socket) {
				socket.emit('createChannel', {
					name: newChannelName,
					userId: currentUser.id,
					ispassword: passwordEnabled,
					password: password,
				});
			}
			setPassword('');
			setChannel('');
		}
	};
	
	const contextValue: ButtonChannelContextValue = {
		displayPopup,
		channels,
		activeChannel,
		handleJoinChannel,
	};

	const contextProfileValue: SideProfileContextValue = {
		user: activeUser,
		onClose: handleActiveUserChange,
		currentUser,
		activeChannel,
	};


	const handlePrivateMessageUserChange = (newUserId: number | null) =>
	{
		setPrivateMessageUserId(newUserId);
		setActiveView('PRIVATE');
		if (newUserId && socket) {
			socket.emit('exitRoom');
			socket.emit('getConversation', {senderId: currentUser.id, receiverId: newUserId});
		}
	}

	useEffect(() => {
		if (socket && currentUser) {
			socket.emit('getChannels');
			socket.on('passwordChecked', (data) => {
				if (data.correct && channelToJoin) {
					setActiveView('CHANNEL');
					setActiveChannel(channelToJoin);
					socket.emit('getChannelConversation', {channelId: channelToJoin.id});
					socket.emit('getChannelUsers', { channelId: channelToJoin.id });
					setShowPasswordPopup(false);
				} else {
					setPasswordIncorrect(true);
				}
			});

			socket.on('channels', (channels: Channel[]) => {
				setChannels(channels);
			});
			
			socket.on('channelCreated', (newChannel: Channel) => {
				setChannels((prevChannels) => [
					...prevChannels,
					{id: newChannel.id, name: newChannel.name, ispassword: newChannel.ispassword, password: newChannel.password, ownerId: newChannel.ownerId}
				]);
			});

			socket.on('userKicked', (userId: string) => {
				setChannelUsers(prevChannelUsers => {
					return prevChannelUsers.filter(ChanUser => ChanUser.id !== parseInt(userId));
				})
				kick(userId);
			});
			
			socket.on('userBanned', () => {
				setActiveChannel(null);
				setChannelToJoin(null);
				handleLeaveChannel();
			});

			return () => {
				socket.off('getChannels');
				socket.off('channelCreated');
				socket.off('passwordChecked');
				socket.off('channels');
				socket.off('handleAdmin');
				socket.off('userKicked');
				socket.off('userBanned');
			};
		}
	}, [socket, currentUser, channelToJoin, kick, setChannelUsers]);

	return (
	<SocketContext.Provider value={socket}>
		<div className="chat-page">
			<Header />
			<div className="content">
				<buttonChannelContext.Provider value={contextValue}>
					<div className="sidebar">
						<Sidebar/>
					</div>
				</buttonChannelContext.Provider>
                <div className={`chat-section ${activeView === 'PRIVATE' ? 'active' : ''}`}>
				{privateMessageUserId && currentUser &&
					<>
						<DirectMessageForm senderId={currentUser.id}
											receiverId={privateMessageUserId} />
						<ChatBox senderId={currentUser ? currentUser.id : -1}
											receiverId={privateMessageUserId ? privateMessageUserId : -1} />
					</>
				}
				</div>
				<SideProfileContext.Provider value={contextProfileValue}>
				<div className={`channel-section ${activeView === 'CHANNEL' ? 'active' : ''}`}>
					{activeChannel && currentUser && (
						<>
							<ChannelForm senderId ={currentUser.id} channelId={parseInt(activeChannel.id)} />
							<ChannelBox senderId ={currentUser ? currentUser.id : -1} channelId={ activeChannel ? parseInt(activeChannel.id) : -1} toggleUsersPopup={toggleUsersPopup} optionPopUp={toggleOptionsPopup}/>
						</>
						)}
				</div>
				<div className='user-selected'>
					{activeUser && (
						<SideProfile />
						)}
				</div>
				</SideProfileContext.Provider>
				<div className="users-list">
					<UsersList
						setCurrentUser={setCurrentUser}
						setPrivateMessageUserId={handlePrivateMessageUserChange}
					/>
				</div>
				{statepopup && (
					<div className ="popup" >
					<div onClick={displayPopup} className="overlay"></div>
						<div className="popup-content">
							<h2> Create Channel </h2>
							<input ref={createInputRef} placeholder="Name channel..." value={channel} onChange={handleChange} onKeyDown={handleKeyDown}/>
							<button onClick={() => {setPasswordEnabled(!passwordEnabled); setPassword('')}}>Enable Password</button>
							{passwordEnabled && (
								<input type='password' placeholder='Password...' value={password} onChange={handlePasswordChange}></input>
							)}
						<button onClick={handleCreateChannelClick}>OK</button>
						<button className="close-popup"
							onClick={() => { displayPopup(); setChannel('')}}>close
						</button>
						</div>
					</div>
				)}
				{showPasswordPopup && (
    				<div className ="popup" >
    					<div onClick={() => setShowPasswordPopup(false)} className="overlay"></div>
        				<div className="popup-content">
            				<h2> Enter Password </h2>
							<input type='password' value={enteredPassword} placeholder='Password...' onChange={handlePasswordInputChange} onKeyDown={handleIfPasswordTrue}></input>
            				{isPasswordIncorrect && <div className="error">Password is incorrect</div>}
							<button className="close-popup" onClick={() => setShowPasswordPopup(false)}>close</button>
        				</div>
    				</div>
				)}
				{showUsersPopup && (
					<div className="popup">
						<div onClick={toggleUsersPopup} className="overlay"></div>
						<div className="popup-content">
							<h2>Channel users List </h2>
							{allUsers.map((user) => (
								user.id !== currentUser.id && (
									<button key={user.id} className="userbutton" onClick={() => {setActiveUser(user) ;toggleUsersPopup()}}>{user.name} </button>
								)
							))}
							<button className="close-popup" onClick={toggleUsersPopup}>close</button>
						</div>
					</div>
				)}
				{options && (
					<div className="popup">
						<div onClick={toggleOptionsPopup} className="overlay"></div>
						<div className="popup-content">
							<h2>Options</h2>
							<button className="leave Channel" onClick={() => {handleLeaveChannel(); toggleOptionsPopup()}}>leave channel</button>
							{isOwner && (
								<div>
									<button className='unsetPassword' onClick={() => {unsetPassword(); toggleOptionsPopup()}}>unset Password </button>
									<button className='ChangePassword' onClick={() => setShowInputpassword(true)}>set/Change Password </button>
									{showInputpassword && (
										<input type='password' value={enteredPassword} placeholder='Password...' onChange={handlePasswordInputChange} onKeyDown={handleNewPassword}></input>
									)}
								</div>
							)}
							<button className="close-popup" onClick={toggleOptionsPopup}>close</button>
						</div>
					</div>
				)}
			</div>
		</div>
		</SocketContext.Provider>
	);
};

export default ChatPage;

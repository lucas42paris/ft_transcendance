import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts";
import axios from "axios";
import { UserInfos } from "../../services/interfaces/userInfos.interface"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import './Friends.css';
import { useNavigate } from "react-router-dom";
import { ax } from "../../services/axios/axios";

const Friends = () => 
{
	const [users, setUsers] = useState<UserInfos[]>([]);
	const [currentUser, setCurrentUser] = useState<UserInfos | null>(null);
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const token = localStorage.getItem("token");

	useEffect(() =>
	{
		const getCurrentUser = async () =>
		{
			try
			{
				const currentUserResponse = await axios.get("http://localhost:8080/users/me",
				{
					headers:
					{
						Authorization: `Bearer ${token}`,
					},
				});

				setCurrentUser(currentUserResponse.data);
			}
			catch (error)
			{
				console.error('Error fetching current user:', error);
			}
		};

		getCurrentUser();

	}, [token, setCurrentUser]);

	useEffect(() =>
	{
		if (socket && currentUser)
		{
			const fetchFriends = async () =>
			{
				socket.emit('getFriends', {userId: currentUser.id});
			};

			const friendAddedListener = (newFriend: UserInfos) =>
			{
				setUsers((users) => [...users, newFriend]);
			};

			const friendsListener = (friends: UserInfos[]) =>
			{
				setUsers(friends);
			};
	
			const errorListener = (error: any) =>
			{
				console.error('Error:', error.message);
			};

			fetchFriends();

			socket.on('friendAdded', friendAddedListener);
			socket.on('friends', friendsListener);
			socket.on('error', errorListener);

			return () =>
			{
				socket.off('friendAdded', friendAddedListener);
				socket.off('friends', friendsListener);
				socket.off('error', errorListener);
			};
		}

	}, [socket, currentUser]);

	const spectateGame = async (user: UserInfos) =>
	{
		if (!user.playing)
		{
			console.log('User is not currently playing');
			return;
		}
	
		try
		{
			const players = await ax.get('pong/getPlayers', {headers: {Authorization: `Bearer ${token}`}});
		  
			if (players.data.length !== 2)
			{
				console.log("No game is currently being played");
				return;
			}

			navigate('/pongGame');
		}
		catch (error)
		{
			console.error('Could not spectate', error);
		}
	};

	return (
		<div className="content-body friends">
			  <h1>Friends</h1>
			  <table>
				<thead>
				  <tr>
					<th>Username</th>
					<th>Status</th>
					<th>Spectator</th>
				  </tr>
				</thead>
				<tbody>
				{users.map((user: UserInfos) =>
				(
					<tr key={user.id}>
					  <td>{user.name}</td>
						<td className={user.connected ? 'online' : 'offline'}>
							{user.playing ?
								<>
									<div className="playing-indicator" />
									<span>Playing</span>
								</> :
								(user.connected ?
								<>
									<div className="online-indicator" />
									<span>Online</span>
								</> :
								<>
									<div className="offline-indicator" />
									<span>Offline</span>
								</>)
							}
						</td>
					  <td>
						<button onClick={() => spectateGame(user)}>
							<FontAwesomeIcon icon={faEye} />
						</button>
					 </td>
					</tr>
				  ))}
				</tbody>
			  </table>
		</div>
	)
}

export default Friends;

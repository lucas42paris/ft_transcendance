import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserInfos } from '../../../services/interfaces/userInfos.interface';
import Content from '../../../components/content';
import Header from '../../../components/header';
import "./ProfileRedirection.css"

const ProfileRedirection = () =>
{
	const { userId } = useParams();
	const [userInfos, setUserInfos] = useState<UserInfos | null>(null);
	const token = localStorage.getItem("token");
	const [imageSrc, setImageSrc] = useState('');

	useEffect(() =>
	{
		const getUsers = async () =>
		{
			try
			{
				const response = await axios.get(`http://localhost:8080/users/${userId}`,
				{
					headers:
					{
						Authorization: `Bearer ${token}`,
					},
				});

				// console.log(response.data);

				setUserInfos(response.data);
			}
			catch (error)
			{
				console.error("Failed to fetch user.");
			}
		};

		getUsers();

	}, [token, userId]);

	useEffect(() => {
		if (userInfos?.id) {
			fetch('http://localhost:8080/images/' + userInfos.id + '.png')
			.then((response) => {
				if (!response.ok) throw new Error('Image not found');
				return response.blob();
			})
			.then((blob) => {
				setImageSrc(URL.createObjectURL(blob));
			})
			.catch((error) => {
				console.error(error);
			});
		}
	}, [userInfos?.id]);

	return (
		<div>
			<Header />
			<Content>
				<div className="userProfileContainer">
					<img 	className="userAvatar"
							src={imageSrc}
							// src={'/avatar/' + userInfos?.id + '.png'}
							alt="avatar"
							onError={(event) =>
							{
								const target = event.target as HTMLImageElement;
								target.src = '/avatar/auto.png';
							}}
					/>

					<div className="userInformations">
						<p className="userInformationKey">  Name: </p>
						<p className="userInformationValue"> {userInfos?.name} </p>
						<p className="userInformationKey"> Statistiques: </p>
						<p className="userInformationValue"> Wins: {userInfos?.wins} </p>
						<p className="userInformationValue"> Losses: {userInfos?.losses} </p>
						<p className="userInformationValue"> Level: {userInfos?.ladder_level} </p>
						<span> Progression to next level: {`${userInfos?.exp}%`}</span>
					</div>
				</div>

				<div>
					<h1>Match history</h1>
					<table>
						<thead>
							<tr>
								<th>Level</th>
								<th>Won</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
						{userInfos?.ladders?.map((value, index) => (
							<tr key={index}>
        						<td>{value}</td>
        						<td>{userInfos?.wons[index].toString()}</td>
        						<td>{userInfos?.gameDates[index]}</td>
    						</tr>
						))}
						</tbody>
					</table>
				</div>
			</Content>
		</div>
	);
};

export default ProfileRedirection;

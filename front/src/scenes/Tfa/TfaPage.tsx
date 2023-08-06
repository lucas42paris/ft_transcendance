import { useEffect, useState } from 'react';
import { ax } from '../../services/axios/axios'
import { UserInfos } from '../../services/interfaces/userInfos.interface';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./style/TfaPage.css";


const TfaPage = () => {
	
	const [userInfos, setUserInfos] = useState<UserInfos | null>(null);
	const token = localStorage.getItem("tokentfa");
	const [codeInput, setCode] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const getUsers = async () => {
			try {
				const response = await axios.get("http://localhost:8080/users/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUserInfos(response.data);
			} catch (error) {
				console.error("Failed to fetch users.");
			}
		};
		getUsers();
	}, [token]);

	const handleChanges = async () => {
		if (codeInput === '')
			return ;
		try {
			const response = await ax.post("http://localhost:8080/users/qrcode/verify",
				{ name: userInfos?.name, otp: codeInput }, {
				headers: { Authorization: `Bearer ${token}`, },
			});
			if (response.data) {
				navigate('/editprofile');
				let tokentfa = localStorage.getItem('tokentfa');
				if (!tokentfa)
					tokentfa = '';
				localStorage.setItem("token", tokentfa);
				localStorage.setItem("isConnected", "yes");
				localStorage.setItem("userStatus", "connected");
				await ax.patch("users",
					{ connected: true },
					{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				});
			} else {
				localStorage.setItem('tokentfa', '');
				navigate('/');
			}
		}
		catch {
			console.error("could not verify qrcode");
		}
	}

	return (
		<div className='tfaInformations'>
			<label className="tfaInformationKey">Enter your TFA verification code:</label>
			<input className="tfaInformationKey"
				type="text"
				value={codeInput}
				onChange={(event) => setCode(event.target.value)}
			/>
			<button onClick={handleChanges} >Submit</button>
		</div>
	);
};

export default TfaPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ax } from '../../services/axios/axios'
import { AxiosError } from 'axios'
import Content from "../../components/content"

const SigninPage = () => {
	const [nameInput, setName] = useState('');
	const [passwordInput, setPassword] = useState('');
	
	const navigate = useNavigate();

	const handleSignin = async () => {
		try {
			if (!nameInput || !passwordInput)
				return ;
			const dto = {
				name: nameInput,
				password: passwordInput,
			};
			let response = await ax.post('auth/signin', dto);
			if (response.status === 200) {
				if (response.data.tfa === true) {
					localStorage.setItem("tokentfa", response.data.access_token);
					navigate('/tfa');
				}
				else {
					localStorage.setItem("token", response.data.access_token);
					localStorage.setItem("isConnected", "yes");
					localStorage.setItem("userStatus", "connected");
					await ax.patch("users", {
							connected: true,
						}, {
							headers: {
							Authorization: `Bearer ${response.data.access_token}`
						},
					});
					response = await ax.get("http://localhost:8080/users/me", {
						headers: {
							Authorization: `Bearer ${response.data.access_token}`,
						},
					});
					navigate('/editprofile');
				}
			}
		}
		catch (error) {
			const axiosError = error as AxiosError<{ message: string; statusCode: number }>;
			if (axiosError?.response?.data?.message === "Credentials incorrect") {
				const message = document.getElementById("message");
				if (message)
					message.textContent = "Wrong Name or Password";
			}
			else
				console.error('Failed to sign in');
		};
	};
	
	return (
		// <AuthProvider>
			<Content>
				<div>
					<h1>Signin</h1>
					<div>
						<label>Name:</label>
						<input
							type="text"
							value={nameInput}
							onChange={(event) => setName(event.target.value)}
							/>
					</div>
					<div>
						<label>Password:</label>
						<input
							type="password"
							value={passwordInput}
							onChange={(event) => setPassword(event.target.value)}
							/>
					</div>
					<button onClick={handleSignin}>Submit</button>
					<div id="message"></div>
				</div>
			</Content>
		// {/* </AuthProvider> */}
	);

};

export default SigninPage;

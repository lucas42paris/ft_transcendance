import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserInfos } from "../../services/interfaces/userInfos.interface"
import Content from "../../components/content"
import Header from "../../components/header"

const HomePage = () => {

	const [userInfos, setUserInfos] = useState<UserInfos | null>(null); //creer une interface afin d'acceder a tout
	const token = localStorage.getItem("token");

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

	return (
		<div>
			<Header />
				<Content>
					<h1> Hi {userInfos?.name} </h1>
					<h1>Welcome to ft_transcendence!</h1>
					<br></br>
					<Link to="/profile">User profile</Link>
					<br></br>
					<br></br>
					<Link to="/editprofile">Edit your profile</Link>
					<br></br>
					<br></br>
					<Link to="/online">See who's online</Link>
					<br></br>
					<br></br>
					<Link to="/pong">Play pong</Link>
					<br></br>
					<br></br>
					<Link to="/chat">Chat with friends</Link>
					<br></br>
				</Content>
			</div>
		);

};

export default HomePage;

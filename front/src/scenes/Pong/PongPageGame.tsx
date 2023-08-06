import { useNavigate } from "react-router-dom";
import Content from "../../components/content"
import { SketchComponent } from "./P5/sketch"
import { ax } from "../../services/axios/axios";
import React from "react";

const PongPage = () => {

	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const userAgent = navigator.userAgent;

    const handleQuit = async () => {
		try {
			const response = await ax.get("http://localhost:8080/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			await ax.patch('users',
				{ playing: false },
           		{ headers: { Authorization: `Bearer ${token}` } }
			);
			await ax.patch('pong/removePlayer',
 		        { name: response.data.name },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch {
			console.error('could not remove player when quitting');
		}
        navigate("/pong");
		if (userAgent.indexOf('Chrome') > -1)
		window.location.reload();
    };
	
	const BackButtonListener = ({children}: any) => {
		React.useEffect(() => {
			window.onpopstate = e => {
				handleQuit();
			};
		});
		return <div></div> ;
	};
	
	return (
		<div>
			<Content>
				<h1>Pong</h1>
				<br></br>
				<BackButtonListener />
                <SketchComponent />
				<button onClick={() => handleQuit()}>Quit</button>
				<br></br>
			</Content>
		</div>
		
	);

};

export default PongPage;

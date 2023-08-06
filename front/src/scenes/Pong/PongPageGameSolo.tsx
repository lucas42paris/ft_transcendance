import { useNavigate } from "react-router-dom";
import Content from "../../components/content"
import { SketchComponentSolo } from "./P5/sketchSolo"
import { ax } from "../../services/axios/axios";
// import React from "react";

const PongPage = () => {

	const navigate = useNavigate();
	const token = localStorage.getItem("token");

    const handleQuit = async () => {
		try {
			await ax.patch('users',
				{ playing: false },
           		{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch {
			console.error('could not update playing status when quitting');
		}
        navigate("/pong");
        window.location.reload();
    };

	// const BackButtonListener = ({children}: any) => {
	// 	React.useEffect(() => {
	// 		window.onpopstate = e => {
	// 			handleQuit();
	// 		};
	// 	});
	// 	return <div></div> ;
	// };

	return (
		<div>
			<Content>
				<h1>Pong</h1>
				<br></br>
                <SketchComponentSolo/>
				<button onClick={() => handleQuit()}>Quit</button>
				<br></br>
			</Content>
		</div>
	);

};

export default PongPage;

import { useNavigate } from "react-router-dom";
import { ax } from "../../services/axios/axios";

const PongRedirecPage = () => {

	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const remove = async () => {
		try {
			const response = await ax.get("http://localhost:8080/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			await ax.patch('users',
				{ playing: false },
				{ headers: { Authorization: `Bearer ${token}` } }
		    );
			await ax.patch(
				'pong/removePlayer',
 		        { name: response.data.name },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch {
			console.error('could not remove player when opponent quit game')
		}
        navigate("/pong");
	}
	remove();

	return (
		<div>
		</div>
		
	);

};

export default PongRedirecPage;

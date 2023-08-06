import { useNavigate } from "react-router-dom";
import { ax } from "../../services/axios/axios";

const RoomEmptyPage = () => {

	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	function wait(delay: any) {
		return new Promise(resolve => {
			setTimeout(resolve, delay);
		})
	}

	const waiting = async () => {
		await wait(5000);
        navigate('/pongGame');
	}
	waiting();

    const removePlayer = async () => {
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
            console.error('could not remove player when quitting matchmaking');
        }
    }
	
    const BackButtonListener = ({children}: any) => {
        removePlayer();
		navigate('/');
		return <div></div> ;
	};

	return (
        <div className="loading-container">
        <h1 className="loading-text">Found empty room, redirecting you to game...</h1>
        <div className="loading-circle"></div>
		<BackButtonListener />
      </div>
	);

};

export default RoomEmptyPage;

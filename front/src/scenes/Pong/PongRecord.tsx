import { useLocation, useNavigate } from "react-router-dom";
import { ax } from "../../services/axios/axios";
import { useEffect, useState } from "react";

const PongRecord = () => {

	const navigate = useNavigate();
	const [currentTime, setCurrentTime] = useState(new Date());
	const token = localStorage.getItem('token');

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

    const Record = async () => {
		const location = useLocation();
		const params = new URLSearchParams(location.search);
		const wons = params.get('won');
		let won: Boolean;
		if (wons === 'true')
			won = true;
		else
			won = false;
		try {
			const response = await ax.get('http://localhost:8080/users/me', {
				headers: { Authorization: `Bearer ${token}` }
            });
            const ladder = response.data.ladder_level;
            await ax.post('match-history', {
					ladder: ladder,
					won: won,
					gameDate: currentTime.toLocaleDateString(),
				}, {
					headers: { Authorization: `Bearer ${token}` },
			});
			let exp;
			if (won === true) {
				await ax.patch('users', {
					wins: response.data.wins + 1,
				},
				{ headers: { Authorization: `Bearer ${token}` }});
				exp = response.data.exp + 100 / ladder;
			}
			else {
				await ax.patch('users', {
					losses: response.data.losses + 1,
				},
				{ headers: { Authorization: `Bearer ${token}` }});
				exp = response.data.exp;
			}
			if (exp >= 100)
				await ax.patch('users', {
					ladder: response.data.ladder_level + 1,
					exp: 0,
				},
				{ headers: { Authorization: `Bearer ${token}` }});
			else
				await ax.patch('users', {
					exp: exp,
				},
				{ headers: { Authorization: `Bearer ${token}` }});
        } catch {
            console.error('could not add match history');
        }
		try {
			const response = await ax.get("http://localhost:8080/users/me", {
				headers: { Authorization: `Bearer ${token}`},
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
			console.error('could not remove player when quitting');
		}
        navigate("/pong");
    };
    Record();

	return (
		<div>
		</div>
	);

};

export default PongRecord;

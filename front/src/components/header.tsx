import { Link } from 'react-router-dom';
import  "../style/components.css"
import { ax } from '../services/axios/axios';

export default function Header () {
    const userStatus = localStorage.getItem("userStatus");
	const token = localStorage.getItem("token");

    const myTest = () => {
        if (userStatus === "connected")
            localStorage.setItem("userStatus", "playing");
        else
            localStorage.setItem("userStatus", "connected");
    }

    const logout = async() => {
        localStorage.setItem("token", "");
        localStorage.setItem("userStatus", "offline");
        localStorage.setItem("isConnected", "no");
        try {
            await ax.patch("users", {
                connected: false,
            }, {
				headers: {
					Authorization: `Bearer ${token}`
				},
			});
        }
        catch {
            console.error("could not change connected to false");
        }
    }

    return (
        <div className="header-body">
            <button className="header-test" onClick={myTest}>test</button> 
            <div className={`header-status ${userStatus}`}>
                {userStatus === 'connected' && 'Connected'}
                {userStatus === 'offline' && 'Offline'}
                {userStatus === 'playing' && 'Playing a Game'}
            </div>
            <Link className="header-links" to="/home">Home</Link>
            <Link className="header-links" to="/profile">Profile</Link>
            <Link className="header-links" to="/pong">Pong</Link>
            <Link className="header-links" to="/chat">Chat</Link>
            <Link className="header-links" to="/friends">Friends</Link>
            <Link className="header-links" onClick={logout} to="/">Logout</Link> 
        </div>
    )
}
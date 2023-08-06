import { useContext } from "react";
import { buttonChannelContext } from "../MainPage/MainPage"
import './Sidebar.css';

const Sidebar = () =>
{
	const { displayPopup, channels, handleJoinChannel } = useContext(buttonChannelContext);

	return (
		<div className="search-add">

			<div className="first-line">

				<div className="channels-text">
					<p>CHANNELS</p>
				</div>

				<div className="icons">
					<button onClick={displayPopup}>
						<i className="fas fa-plus"></i>
					</button>
				</div>
			</div>
			<div className="chanbutton-container">
				{channels.map((channel) => (
					<button key={channel.id} className="chanbutton" onClick={() => handleJoinChannel(channel)}>{channel.name}</button>
					))}
			</div>
		</div>
	);
};

export default Sidebar;
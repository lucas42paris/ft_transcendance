import { useCallback, useContext, useEffect, useState } from "react";
import { ChanToUserContext, ChanUsersContext, SideProfileContext, SocketContext } from '../../../contexts';
import "./SideProfile.css";
import { RxCross1 } from 'react-icons/rx'
import { ChanUser } from "../MainPage/MainPage";


const SideProfile = () => {

    const socket = useContext(SocketContext);
    const { user, onClose, currentUser, activeChannel } = useContext(SideProfileContext);
    const { allUsers } = useContext(ChanUsersContext);
	const allrelations = useContext(ChanToUserContext);
    const [isAdmin, setIsAdmin] = useState(false);
	const [buttonEnable, setButtonEnable] = useState(false);
	const [buttonOwnerEnable, setButtonOwnerEnable] = useState(false);

    const isRights = useCallback((user: ChanUser) => {
		const currentuserFromAllUsers = allUsers.find(user => user.id === currentUser.id);
		if (currentuserFromAllUsers) {
			if (activeChannel && currentuserFromAllUsers.ownedChannels.some(channel => channel.id === activeChannel.id)) {
				setButtonOwnerEnable(true);
			} else
				setButtonOwnerEnable(false);
			if (user && activeChannel && allrelations !== null && user.id !== parseInt(activeChannel.ownerId)) {
				const adminbool = allrelations.find(relation => relation.userId === currentuserFromAllUsers.id && relation.channelId === activeChannel.id)
                if (adminbool)
                    setButtonEnable(adminbool.isAdmin);
            } else
                setButtonEnable(false);
			if (allrelations !== null && user && activeChannel) {
				const adminbool = allrelations.find(relation => relation.userId === user.id && relation.channelId === activeChannel.id)
				if (adminbool)
					setIsAdmin(adminbool.isAdmin);
			}
		}
	}, [activeChannel, allUsers, allrelations, currentUser] );

    
    const handleAddFriend = async () =>
	{
		if (currentUser && socket && user)
			socket.emit('addFriend', {userId: currentUser.id, friendId: user.id});
		else 
			console.error('Current user is null or socket is not available');
	}

    const handleAdmin = async () => {
        if (socket && activeChannel && user)
            socket.emit('handleAdmin', {userId: user.id, channelId: activeChannel.id});
        else
            console.error('this user is null or socket is not available');
    }
    
    const handleLeaveChannel = async () => {
        if (socket && activeChannel && user) {
          socket.emit('leaveRoom', {channelId: activeChannel.id, userId: user.id.toString()});
        }
    }

    const handleMuted = async () => {
        if (socket && activeChannel && user) {
            socket.emit('handleMuted', {userId: user.id, channelId: activeChannel.id});
        }
        else
            console.error('this user is null or socket is not available');
    }

    const handleBanned = async () => {
        if (socket && activeChannel && user)
            socket.emit('handleBanned', {userId: user.id, channelId: activeChannel.id});
        else
            console.error('this user is null or socket is not available');
    }

    useEffect(() => {
		if (user && socket && activeChannel) {
			socket.emit('getChannelToUser', { channelId: activeChannel.id });
			isRights(user);
		}
	}, [socket, user, activeChannel, isRights] );

    return (
        <div className="side-profile">
            <button className="close-button" onClick={onClose}> <RxCross1/></button>
            {user ? user.name : 'unknown user'}
            <button className="add-button" onClick={() => {onClose(); handleAddFriend()}}>add friend</button> 
            {(buttonEnable || buttonOwnerEnable) && (
                <div>
                <button className="kick-button" onClick={() => {onClose(); handleLeaveChannel()}}>kick</button>
                <button className="ban-button" onClick={() => {onClose(); handleBanned(); handleLeaveChannel()}}>ban</button>
                <button className="mute-button" onClick={() => {onClose(); handleMuted()}}>mute</button>
                </div>
            )}
            {buttonOwnerEnable && !isAdmin && (
                <button className="admin-button" onClick={() => {onClose(); handleAdmin()}}>set {user ? user.name : 'unknown user'} as administrator</button>
            )}
            {buttonOwnerEnable && isAdmin && (
                <button className="unadmin-button" onClick={() => {onClose(); handleAdmin()}}>unset {user ? user.name : 'unknown user'} as administrator</button>
            )}
        </div>
    );
};

export default SideProfile;
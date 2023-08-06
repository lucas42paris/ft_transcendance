import { UserInfos } from '../../../services/interfaces/userInfos.interface';
import DropdownItem from './DropdownItem';

interface DropdownMenuProps
{
	user: UserInfos;
	onDirectMessageClick: () => void;
	onAddFriendClick: () => void;
	onBlockClick: () => void;
	onInviteToPongClick: () => void;
	navigate: (path: string) => void;
	isBlocked: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({user, onDirectMessageClick,
													onAddFriendClick, onBlockClick,
													onInviteToPongClick, navigate,
													isBlocked}) =>
{
	return (
		<ul className="dropdown-menu">

			{!isBlocked && (
				<>
					<DropdownItem onClick={() => navigate(`/profile/${user.id}`)}>
						Profile </DropdownItem>

					<DropdownItem onClick={onDirectMessageClick}>
						Direct Message </DropdownItem>

					<DropdownItem onClick={onAddFriendClick}>
						Add friend </DropdownItem>

					<DropdownItem onClick={onBlockClick}>
						Block </DropdownItem>

					<DropdownItem onClick={onInviteToPongClick}>
						Invite to Pong </DropdownItem>
				</>
			)}
		</ul>
	);
};

export default DropdownMenu;
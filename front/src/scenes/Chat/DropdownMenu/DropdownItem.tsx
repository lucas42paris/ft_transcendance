import React from 'react';

interface DropdownItemProps
{
	children: React.ReactNode;
	onClick: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({children, onClick}) =>
{
	return (
		<li className="dropdown-item" onClick={onClick}>
			{children}
		</li>
	);
};

export default DropdownItem;

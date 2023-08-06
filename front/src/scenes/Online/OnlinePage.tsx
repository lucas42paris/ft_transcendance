import { useEffect, useState } from "react";
import { UserInfos } from "../../services/interfaces/userInfos.interface"
import axios from "axios";
import Content from "../../components/content"
import Header from "../../components/header"

const OnlinePage = () => 
{
	// const [userInfos, setUserInfos] = useState<UserInfos | null>(null);
	const	[users, setUsers] = useState([]);
	const	token = localStorage.getItem("token");

	useEffect(() =>
	{
		const fetchUsers = async () => 
		{
			try
			{
			  const	response = await axios.get("http://localhost:8080/users",
			  {
				headers:
				{
					Authorization: `Bearer ${token}`,
				},
			  });

				setUsers(response.data);
			}
			catch (error)
			{
				console.error('Error fetching users:', error);
			}
		  };

			fetchUsers();
	},[token]);

	const	booleanToString = (value: boolean) =>
	{
		return (value ? 'Yes' : 'No');
	};

	return (
		<div>
			<Header />
			<Content>
				<div>
				<h1>User List</h1>
      			<ul>
   				    {users.map((user: UserInfos) => 
					(
        				<li key={user.id}>
							<div>
							{user.name}
							</div>
							Online: {booleanToString(user.connected)}
						</li>
        			))}
      			</ul>
				</div>
			</Content>
		</div>
	);
};

export default OnlinePage;

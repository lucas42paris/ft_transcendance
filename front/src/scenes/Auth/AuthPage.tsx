import { Link } from "react-router-dom";
import Content from "../../components/content"
import { ax } from '../../services/axios/axios'

const AuthPage = () => {

	const handle42 = async () => {
		try {
			ax.get('/auth/login/42')
				.then((res) => {
					window.location.href = res.data.url;
				});
		}
		catch {
			window.alert("can't login with 42");
		}
	}

	return (
		<Content>
			<div>
				<h1>Identify yourself</h1>
				<br></br>
				<Link to="/signup">Signup</Link>
				<br></br>
				<br></br>
				<Link to="/signin">Signin</Link>
				<br></br>
				<br></br>
				<button onClick={handle42}>42 login</button>
				<br></br>
			</div>
		</Content>
	);

};

export default AuthPage;

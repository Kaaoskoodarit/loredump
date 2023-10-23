import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {register,registerFailed,login} from '../actions/loginActions';

const LoginPage = (props) => {
	
	const [state,setState] = useState({
		username:"",
		password:""
	})
	
	const dispatch = useDispatch();
	
	const onChange = (event) => {
		setState((state) => {
			return {
				...state,
				[event.target.name]:event.target.value
			}
		})
	}
	
	const onSubmit = (event) => {
		event.preventDefault();
		if(state.username.length < 4 || state.password.length < 8) {
			dispatch(registerFailed("Username must be atleast 4 and password 8 characters long"));
			return;
		}
		let user = {
			...state
		}
		if(event.target.name === "register") {
			dispatch(register(user));
		} else {
			dispatch(login(user));
		}
	}
	
	return(
		<div style={{
			"backgroundColor":"pink",
			"width":"40%",
			"margin":"auto"
		}}>
			<form className="mb-5">
				<label htmlFor="username" className="form-label">Username</label>
				<input type="text"
						id="username"
						name="username"
						className="form-control"
						onChange={onChange}
						value={state.username}/>
				<label htmlFor="password" className="form-label">Password</label>
				<input type="password"
						id="password"
						name="password"
						className="form-control"
						onChange={onChange}
						value={state.password}/>
				<button onClick={onSubmit} style={{marginRight:5}} name="register" className="btn btn-secondary">Register</button>
				<button onClick={onSubmit} style={{marginLeft:5}} name="login" className="btn btn-secondary">Login</button>
			</form>
		</div>
	)
}

export default LoginPage;
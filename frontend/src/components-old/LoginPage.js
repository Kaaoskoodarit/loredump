import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {register,registerFailed,login} from '../actions/loginActions';
//import {getList} from '../actions/pageActions';
//import {getCategoryList} from '../actions/categoryActions';
//import { getWorldList } from '../actions/worldActions';
//import { useSelector } from 'react-redux';

// LoginPage component, that handles logging in
const LoginPage = (props) => {
	
	// Set state of the component
	const [state,setState] = useState({
		username:"",
		password:""
	})
	//const worldlist = useSelector(state => state.world.list);
	//const loggedin = useSelector(state => state.login.isLogged)
	
	// Lets us use dispatch function from Redux store
	const dispatch = useDispatch();
	
	// Function to handle "onChange" events in components
	const onChange = (event) => {
		setState((state) => {
			return {
				...state,
				[event.target.name]:event.target.value
			}
		})
	}
	
	// Function to handle "onSubmit" events in components
	const onSubmit = (event) => {
		// prevent default operation of the "Submit" button
		event.preventDefault();
		// Check if username and password are proper lengths
		if(state.username.length < 4 || state.password.length < 8) {
			dispatch(registerFailed("Username must be atleast 4 and password 8 characters long"));
			return;
		}
		let user = {
			...state
		}
		// If person is trying to register, dispatch a register action
		if(event.target.name === "register") {
			dispatch(register(user));
		// Else dispatch a login action
		} else {
			// ASYNC! Wait for login to finish first, then look for world list!
			// useEffect? when "isLogged" changes!
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
				<button onClick={onSubmit} style={{marginLeft:5}} name="login" className="btn btn-secondary">Login</button>
				<button onClick={onSubmit} style={{marginRight:5}} name="register" className="btn btn-secondary">Register</button>
			</form>
		</div>
	)
}

export default LoginPage;
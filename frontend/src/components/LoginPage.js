import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {register,registerFailed,login} from '../actions/loginActions';
import { Button, Card } from '@mui/material';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';



// LoginPage component, that handles logging in
const LoginPage = (props) => {
	
	// Set state of the component
	const [state,setState] = useState({
		username:"",
		password:""
	})

	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	
	  
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
			dispatch(login(user));
		}
	}
	
	return(
		<Container maxWidth="sm">
<Card elevation={6} >
<form id="login">
<FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
<TextField label="Username" value={state.username} name="username" onChange={(event)=>onChange(event)} />		
</FormControl>

<FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">


  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
  <OutlinedInput
	id="outlined-adornment-password"
	type={showPassword ? 'text' : 'password'}
	endAdornment={
	  <InputAdornment position="end">
		<IconButton
		  aria-label="toggle password visibility"
		  onClick={handleClickShowPassword}
		  onMouseDown={handleMouseDownPassword}
		  edge="end"
		>
		  {showPassword ? <VisibilityOff /> : <Visibility />}
		</IconButton>
	  </InputAdornment>
	}
	label="Password"
	name="password"
	value={state.password}
	onChange={(event)=>onChange(event)}
  />
</FormControl>

<Stack spacing={1} direction='row' 
			justifyContent="center"> 
<Button name="login" variant="contained" type="submit" form="login" onClick={onSubmit}>Log in</Button>
<Button name="register" variant="contained" type="submit" form="login" color='secondary' onClick={onSubmit}>Register</Button>
</Stack>
</form>

</Card>
		</Container>

	)
}

export default LoginPage;
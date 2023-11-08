import {Link} from 'react-router-dom'
import { useState } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {logout} from '../actions/loginActions';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

 

const Navbar1 = (props) => {
	
	const dispatch = useDispatch();
	const state = useSelector((state) => {
		return {
			isLogged:state.login.isLogged,
			token:state.login.token,
			user:state.login.user,
			//world:state.world.title
		}
	})
	const isLogged = state.isLogged
	const title = state.title

	//const [auth, setAuth] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);
  
	// const handleChange = (event) => {
	//   setAuth(event.target.checked);
	// };
  
	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};
  
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	return(
		<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static"  color="secondary">
			<Toolbar variant="dense">

			<Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
				LoreDump
			</Typography>
			<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
			Treasure trove for all your Worldbuilding Lore
			</Typography>
			{isLogged && (
				<div>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					onClick={(e)=>handleMenu(e,"E1")}
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorEl}
					anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
					}}
					open={Boolean(anchorEl)}
					onClose={()=>handleClose("E1")}
				>
					<MenuItem onClick={()=>handleClose("E1")}>Profile</MenuItem>
					<MenuItem onClick={()=>handleClose("E1")}>My account</MenuItem>
					<MenuItem onClick={()=>handleClose("E1")}>
					<Link className="nav-link" to="/" onClick={() => dispatch(logout(state.token))}>Logout</Link>
					</MenuItem>
				</Menu>
				</div>
			)}
			</Toolbar>
		</AppBar>
		</Box>
	)
}

export default Navbar1;
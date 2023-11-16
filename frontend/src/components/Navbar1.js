import {Link as RouterLink} from 'react-router-dom'
import { useState } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {logout, selectTheme} from '../actions/loginActions';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Divider } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';

 

const Navbar1 = (props) => {
	
	const dispatch = useDispatch();
	const state = useSelector((state) => {
		return {
			isLogged:state.login.isLogged,
			user:state.login.user,
			username:state.login.username,
			theme:state.login.theme
			//world:state.world.title
		}
	})
	const isLogged = state.isLogged

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

	const handleThemeChange = (theme) =>{
		dispatch(selectTheme(theme));
		handleClose();
	}

	const selected =   <ListItemIcon>
						<Check />
						</ListItemIcon>
	
	//REPLACE TREASURE TROVE... WITH CURRENT WORLD NAME
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
				<>
					<Typography>Welcome, {state.username}</Typography>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					onClick={(e)=>handleMenu(e)}
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorEl}
					anchorOrigin={{
					vertical: 'bottom',
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
					<MenuItem disabled>Change Theme</MenuItem>
					<MenuItem onClick={()=>handleThemeChange("Dark")} >
						{state.theme==="Dark"&&selected} 
						<ListItemText inset={state.theme!=="Dark"}>Dark</ListItemText>
						</MenuItem>

					<MenuItem onClick={()=>handleThemeChange("Orange")} >
						{state.theme==="Orange"&&selected} 
						<ListItemText inset={state.theme!=="Orange"}>Orange</ListItemText>
						</MenuItem>

					<MenuItem onClick={()=>handleThemeChange("Muted")} >
						{state.theme==="Muted"&&selected}
						<ListItemText inset={state.theme!=="Muted"}>Muted</ListItemText>
						</MenuItem>
					<Divider/>
					<MenuItem onClick={()=>{
						handleClose("E1");
						dispatch(logout())}} component={RouterLink} to={"/"}>
					Logout
					</MenuItem>
					{/* <Link className="nav-link" to="/" onClick={() => dispatch(logout())}>Logout</Link> */}
				</Menu>
				</>
			)}
			</Toolbar>
		</AppBar>
		</Box>
	)
}

export default Navbar1;
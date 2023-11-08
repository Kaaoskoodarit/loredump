import {Link as RouterLink} from 'react-router-dom'
import {useParams} from 'react-router-dom'
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
import Link from '@mui/material/Link';
import { Breadcrumbs } from '@mui/material';

 

const Navbar2 = (props) => {
	
	const dispatch = useDispatch();
	const state = useSelector((state) => {
		return {
			isLogged:state.login.isLogged,
			user:state.login.user,
			title:state.lore.page.title,
			categorylist:state.category.list,
			worldid: state.world.page.id,
			worldurl: state.world.page.custom_url
		}
	})
	const worldid = state.worldid
	const worldurl = state.worldurl
	const isLogged = state.isLogged
	const title = state.title
	const categorylist = state.categorylist


	//const [auth, setAuth] = useState(true);
	const [anchorE1, setAnchorE1] = useState(null);
  

  
	const handleMenu = (event) => {
		console.log("handling menu...",)
		setAnchorE1(event.currentTarget);
	};
  
	const handleClose = () => {
		setAnchorE1(null) ;
	};
	
	const catLinks = categorylist? categorylist.map((cat,index) => {
		return(<Link key={cat.id} variant="h6" color="inherit" underline="hover" component={RouterLink} 
		to={"/"+worldurl+"/category/"+cat.id}>{cat.title}</Link>)
		}): "" ;
	
	
	
	if(state.isLogged) {
		return(	
			<Box sx={{ flexGrow: 1 }}>
			
			<AppBar position="static" color="primary">
			  <Toolbar variant="dense">
			  <Breadcrumbs aria-label="breadcrumb" separator="|">
				<Link variant="h6" color="inherit" underline="hover" component={RouterLink} to={"/"+worldurl}>All Pages</Link>
			  {catLinks}
				<Link variant="h6" color="alert" underline="hover" component={RouterLink} to={"/new-page"}>Create a new Lore Page</Link>

			  
			  </Breadcrumbs>
			  </Toolbar>
			</AppBar>
		  </Box>
		)
	} else {
		return;
	}
}

export default Navbar2;
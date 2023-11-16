import {Link as RouterLink} from 'react-router-dom'
import { useState } from 'react';
import {useSelector} from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
 import IconButton from '@mui/material/IconButton';
 // import Switch from '@mui/material/Switch';
 // import FormControlLabel from '@mui/material/FormControlLabel';
 // import FormGroup from '@mui/material/FormGroup';
 import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Link from '@mui/material/Link';
import { Breadcrumbs } from '@mui/material';

 

const Navbar2 = (props) => {
	
	
	const state = useSelector((state) => {
		return {
			isLogged:state.login.isLogged,
			user:state.login.user,
			title:state.lore.page.title,
			categorylist:state.category.list,
			lore:state.lore.list,
			worldTitle: state.world.page.title,
			worldurl: state.world.page.custom_url
		}
	})
	const worldTitle = state.worldTitle
	const worldurl = state.worldurl
	const lore = state.lore
	const categorylist = state.categorylist


	//const [auth, setAuth] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);
  

  
	const handleMenu = (event) => {
		//console.log("handling menu...",)
		setAnchorEl(event.currentTarget);
	};
  
	const handleClose = () => {
		setAnchorEl(null) ;
	};
	
	const catLinks = categorylist? categorylist.map((cat) => {
		return(
		<MenuItem onClick={()=>handleClose("E1")}>
			<Link key={cat.id} variant="h6" color="inherit" underline="hover" component={RouterLink} 
			to={"/"+worldurl+"/category/"+cat.custom_url}>{cat.title}</Link>
		</MenuItem>
		)
		}): "" ;	
	
	const allPages = lore&&lore.length>0 ?
		<Link variant="h6" color="inherit" underline="hover" component={RouterLink} to={"/"+worldurl}>All Pages</Link>
	 	: ""
		
	
	if(state.isLogged) {
		return(	
			<Box sx={{ flexGrow: 1 }}>
			
			<AppBar position="static" color="primary">
			  <Toolbar variant="dense">
			  <Breadcrumbs aria-label="breadcrumb" separator="|">
				<Link variant="h4" color="inherit" underline="hover" component={RouterLink} to={"/"}>{worldTitle}</Link>
				{allPages}
				<IconButton
					size="large"
					aria-haspopup="true"
					onClick={(e)=>handleMenu(e,"E1")}
					color="inherit">
					<MenuIcon />
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
					<MenuItem disabled onClick={()=>handleClose("E1")}>Categories</MenuItem>
			  		{catLinks}
				</Menu>
				<Link variant="h6" color="success" underline="hover" component={RouterLink} to={"/"+worldurl+"/new-page"}>Create a new Lore Page</Link>
				<Link variant="h6" color="success" underline="hover" component={RouterLink} to={"/"+worldurl+"/new-category"}>Create a new Category</Link>

			  
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
import { Card,CardMedia,CardContent, CardActions, Stack, Typography,Button } from "@mui/material"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from "react";
import {useSelector} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom'
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';


// Component that shows a normal list entry, with "remove" and "edit" buttons
const Row = (props) => {
	//console.log("Row: props.page",props.page)
	// const categories = props.page.categories.map((category,i)=><p key={props.page.title+i+category}>{category}</p>)
	const categories =<p>Categories</p>
	const default_img = 'https://media.discordapp.net/attachments/1161992163765256203/1169189304220782662/image.png?ex=65547f64&is=65420a64&hm=32e108ff3fe3bb4e9bb89feed07a87015edb99fcc6a8f1d1ecc6b2ae8d4f0017&='
	const image = (props.page.image!=="")? props.page.image: default_img;
  	const [tab, setTab] = useState('1');

	const handleChange = (event, newValue) => {
		setTab(newValue);
	};
	
	const categorylist = useSelector(state => state.category.list);
	
	const getCategoryTitle = (id) => {
		for (const category of categorylist){
			if (category.id === id) return category.title
		}
		return id;
	}

	let categories_listed;
	if(props.page.categories){
		categories_listed = props.page.categories.map((id,index)=>{
			let categoryTitle = getCategoryTitle(id)
			return (
			<Link key={index+id} color="alert" underline="hover" component={RouterLink} 
			to={"/category/"+id}>{categoryTitle}</Link>
			)
		})	
	}

	//className="nav-link"
	return(
	<Card elevation={6} sx={{ display: 'flex' }}>
		<Box  sx={{ display: 'flex', flexDirection: 'column' }}>
		<CardContent sx={{ flex: '1 0 auto' }}>
		<Link variant="h5" color="inherit"  underline="hover" component={RouterLink} to={"/lorepage/"+props.page.id}>{props.page.title}</Link>
	<TabContext value={tab}>
		<TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary">
			<Tab label="Summary" value="1"/>
			<Tab label="Categories" value="2"/>
		</TabList>
		<TabPanel value="1">
			<Typography variant="body2" >
			{props.page.summary}
			</Typography>
		</TabPanel>
		<TabPanel value="2">
			<Stack>{categories_listed}</Stack>
		</TabPanel>
	</TabContext>
	</CardContent>
	<CardActions>
			<Button size="small" variant="contained" color="secondary" onClick={() => props.changeMode("edit",props.index)}
				>Edit</Button>
			<Button size="small" variant="contained" >Links</Button>
			<Button size="small" variant="contained" color="alert" onClick={() => props.changeMode("remove",props.index)}
				>Delete</Button>
	</CardActions>
		</Box>
		<CardMedia
		sx={{ maxHeight:250, width: 200 }}
		image={image}
		title={"Image for "+props.page.title}/>

		</Card>
		
	)
}

export default Row;
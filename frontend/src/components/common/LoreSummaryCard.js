import { Card,CardMedia,CardContent, CardActions, Typography,Button, CardActionArea } from "@mui/material"

import {useSelector} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom'
import Link from '@mui/material/Link';
//import Box from '@mui/material/Box';


// Component that shows a normal list entry, with "remove" and "edit" buttons
const LoreSummaryCard = (props) => {
	//console.log("Row: props.page",props.page)
	// const categories = props.page.categories.map((category,i)=><p key={props.page.title+i+category}>{category}</p>)
	//const categories =<p>Categories</p>
	const default_img = 'https://media.discordapp.net/attachments/1161992163765256203/1169189304220782662/image.png?ex=65547f64&is=65420a64&hm=32e108ff3fe3bb4e9bb89feed07a87015edb99fcc6a8f1d1ecc6b2ae8d4f0017&='
	const image = (props.page.image!=="")? props.page.image: default_img;
	const worldurl = props.worldurl

	const categorylist = useSelector(state => state.category.list);

	const getCategoryTitle = (id) => {
		for (const category of categorylist){
			if (category.id === id) return category.title
		}
		return id;
	}

	const getCategoryUrl = (id) => {
		for (const category of categorylist){
			if (category.id === id) return category.custom_url
		}
		return id;
	}

	let categories_listed;
	if(props.page.categories){
		categories_listed = props.page.categories.map((id,index)=>{
			let categoryTitle = getCategoryTitle(id)
			let categoryUrl = getCategoryUrl(id)
			return (
			<Link key={index+id} color="alert" underline="hover" component={RouterLink}
			to={"/"+worldurl+"/category/"+categoryUrl}>{categoryTitle}</Link>
			)
		})
	}

	//className="nav-link"
	return(
	<Card elevation={6} sx={{ p:1, display: 'flex', flexDirection: 'column', alignItems:"center" }}>


	{/* <Box  sx={{ display: 'flex', flexDirection: 'column' }}> */}
		<CardActionArea component={RouterLink} to={"/"+worldurl+"/lorepage/"+props.page.custom_url}>
		<CardMedia
		sx={{ height:200, maxWidth:'100%' }}
		image={image}
		title={"Image for "+props.page.title}/>
		<CardContent sx={{ flex: '1 0 auto' }}>
			<Typography variant="h5" color="inherit">{props.page.title}</Typography>
			<Typography variant="body2">{props.page.summary}</Typography>

		</CardContent>
		</CardActionArea>

		<CardActions>
			<Button size="small" variant="contained" color="secondary" onClick={() => props.changeMode("edit",props.index)}
				>Edit</Button>
			<Button size="small" variant="contained" >Links</Button>
			<Button size="small" variant="contained" color="alert" onClick={() => props.changeMode("remove",props.index)}
				>Delete</Button>
	</CardActions>
	{/* </Box> */}



		</Card>

	)
}

export default LoreSummaryCard;
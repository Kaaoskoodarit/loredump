import { useState } from "react";
import {useSelector,useDispatch} from 'react-redux';
import {removePage,editPage} from '../../actions/pageActions';

//import {useSelector} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom'
import UploadWidget from "../Cloudinary/UploadWidget";
//import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { Card,CardMedia,CardContent, CardActions, Typography,Button, CardActionArea, TextField } from "@mui/material"
import { editCategory } from "../../actions/categoryActions";


// Component that shows a normal list entry, with "remove" and "edit" buttons
const LoreSummaryCard = (props) => {

	const appState = useSelector((state) => {
        return {
            worldurl: state.world.page.url,
            worldid: state.world.page.id
        }
    })
	
	//console.log("Row: props.page",props.page)
	// const categories = props.page.categories.map((category,i)=><p key={props.page.title+i+category}>{category}</p>)
	//const categories =<p>Categories</p>
	const default_img = 'https://res.cloudinary.com/kaaoskoodarit/image/upload/v1699876476/user_uploads/skrd5vixnpy7jcc0flrh.jpg'
	const image = (props.page.image!=="")? props.page.image: default_img;
	const worldurl = appState.worldurl
	const worldid = appState.worldid
	const category = props.category

	const dispatch = useDispatch();
	const [state,setState] = useState("default")

	const [editState,setEditState] = useState({
		...props.page,
		title:props.page.title,
		image:props.page.image,
		summary:props.page.summary
	})


	const removeAPage = () => {
		dispatch(removePage(worldid,props.page.id));
		setState("default");
		return;
	}

	const editAPage = () => {
		dispatch(editPage(worldid,editState));
		setState("default");
	}

	const unlinkAPage = () => {
		//REMOVE THIS PAGE FROM THE CATEGORY
		let temparr = [...category.lore_pages];
		temparr.splice(props.index,1);
		let updateCat ={
			...category,
			//Remove just the index entry from array
			lore_pages:temparr,
		} 
		dispatch(editCategory(worldid,updateCat))

		//REMOVE THE CATEGORY FROM THIS PAGE
		let catIndex = props.page.categories.map((id,index)=>{
			if (category.id === id) return index })
		
		//make a shallow copy
		let tempCats = [...props.page.categories];
		tempCats.splice(catIndex,1);
		//Remove just the index entry from array
		let updatePage = {
			id: props.page.id,
			categories : tempCats,
		}
		dispatch(editPage(worldid,updatePage))

		setState("default");
	}
	const onChange = (event) => {

        setEditState((editState) => {
            return {
                ...editState,
                [event.target.name]:event.target.value
            }
        })
    }

	//CODE FOR LISTING CATEGORIES FOR EACH LORE
	
	//const categorylist = useSelector(state => state.category.list);

	// const getCategoryTitle = (id) => {
	// 	for (const category of categorylist){
	// 		if (category.id === id) return category.title
	// 	}
	// 	return id;
	// }

	// const getCategoryUrl = (id) => {
	// 	for (const category of categorylist){
	// 		if (category.id === id) return category.custom_url
	// 	}
	// 	return id;
	// }

	// let categories_listed;
	// if(props.page.categories){
	// 	categories_listed = props.page.categories.map((id,index)=>{
	// 		let categoryTitle = getCategoryTitle(id)
	// 		let categoryUrl = getCategoryUrl(id)
	// 		return (
	// 		<Link key={index+id} color="alert" underline="hover" component={RouterLink}
	// 		to={"/"+worldurl+"/category/"+categoryUrl}>{categoryTitle}</Link>
	// 		)
	// 	})
	// }

	
	//CHOOSE WHICH STATE TO SHOW
	let cardContents; 
	let cardActions;

	//CONTENT ABOVE THE BUTTONS
	if (state==="default"||"unlink"||"delete") {
		cardContents = <>
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
			</>}

	if (state==="edit"){
		cardContents = <>
		<Box sx={{ height:200,width:'100%', display: 'flex', flexDirection: 'column'}} >
		<CardMedia 
		sx={{height:150,objectFit: "contain"}}
		image={editState.image}
		title={"Image for "+props.page.title}/>
		<UploadWidget setState={setEditState}>Change Image</UploadWidget>
		</Box>
		<CardContent sx={{pb:0,px:0,width:'100%'}}>
			<TextField id="title" name="title" label="Title" size="small" fullWidth required multiline maxRows={2}
                value={editState.title} onChange={onChange}/>
			<br/>				
			<TextField sx={{mt:1}} id="summary" name="summary" label="Summary" size="small" fullWidth multiline maxRows={2}
                value={editState.summary} onChange={onChange}/>
		</CardContent>
			</>}

	//BUTTONS 
	if (state==="default"){

	cardActions = <>
			<Button size="small" variant="contained" color="secondary" onClick={() => setState("edit")}
				>Edit</Button>
			{category&&category.title!=="Uncategorised"?<Button size="small" variant="contained" onClick={() => setState("unlink")}
				>Unlink</Button>:""}
			<Button size="small" variant="contained" color="alert" onClick={() => setState("delete")}
				>Delete</Button>
				</>}

	if (state==="unlink"){
		cardActions = <>
				<Button size="small" variant="contained" color="secondary" onClick={() => setState("default")}
					>Cancel</Button>
				<Button size="small" variant="contained" color="alert" onClick={unlinkAPage}
					>Unlink from Category</Button>
					</>}
					
	if (state==="delete"){
		cardActions = <>
				<Button size="small" variant="contained" color="secondary" onClick={() => setState("default")}
					>Cancel</Button>
				<Button size="small" variant="contained" color="alert" onClick={removeAPage}
					>Delete Lore</Button>
					</>
			}

	if (state==="edit"){
		cardActions = <>
				<Button size="small" variant="contained" color="secondary" onClick={() => setState("default")}
					>Cancel</Button>
				<Button size="small" variant="contained" color="success" onClick={editAPage}
					>Save</Button>
					</>}

	return(
	<Card key={props.page.id} elevation={6} sx={{ p:1, display: 'flex', flexDirection: 'column', alignItems:"center" , minWidth:250,maxWidth:400}}>
		{cardContents}
		<CardActions>
		{cardActions}
		</CardActions>
		</Card>

	)
}

export default LoreSummaryCard;
import { useState } from "react";
import {useSelector,useDispatch} from 'react-redux';
import {removePage,editPage} from '../../actions/pageActions';
import { editCategory } from "../../actions/categoryActions";

//import {useSelector} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom'
import UploadWidget from "../Cloudinary/UploadWidget";
//import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { Card,CardMedia,CardContent, CardActions, Typography,Button, CardActionArea, TextField } from "@mui/material"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogActions, DialogTitle, DialogContentText } from '@mui/material';

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
	const [mode,setMode] = useState("default")

	const [editState,setEditState] = useState({
		...props.page,
		title:props.page.title,
		image:props.page.image,
		summary:props.page.summary
	})


	const removeAPage = () => {
		dispatch(removePage(worldid,props.page.id));
		setMode("default");
		return;
	}

	const editAPage = () => {
		dispatch(editPage(worldid,editState));
		setMode("default");
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

		setMode("default");
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
	if (mode==="default"||"unlink"||"delete") {
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

	if (mode==="edit"){
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
	if (mode==="default"){

	cardActions = <>
			<Button size="small" variant="contained" color="secondary" onClick={() => setMode("edit")}
				>Edit</Button>
			{category&&category.title!=="Uncategorised"?<Button size="small" variant="contained" onClick={() => setMode("unlink")}
				>Unlink</Button>:""}
			<Button size="small" variant="contained" color="alert" onClick={() => setMode("delete")}
				>Delete</Button>
				</>}

	if (mode==="unlink"){
		cardActions = <>
				<Button size="small" variant="contained" color="secondary" onClick={() => setMode("default")}
					>Cancel</Button>
				<Button size="small" variant="contained" color="alert" onClick={unlinkAPage}
					>Unlink from Category</Button>
					</>}
					
	if (mode==="delete"){
		cardActions = <>
				<Button size="small" disabled variant="contained" color="secondary" onClick={() => setMode("edit")}
				>Edit</Button>
			{category&&category.title!=="Uncategorised"?<Button size="small" disabled variant="contained" onClick={() => setMode("unlink")}
				>Unlink</Button>:""}
			<Button size="small" disabled variant="contained" color="alert" onClick={() => setMode("delete")}
				>Delete</Button>
					</>
			}

	if (mode==="edit"){
		cardActions = <>
				<Button size="small" variant="contained" color="secondary" onClick={() => setMode("default")}
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

		<Dialog fullWidth maxWidth='sm' open={mode==="delete"} onClose={()=>setMode("default")} aria-label="confirm-delete-dialog">
        <DialogTitle>
			Deleting Lore Page: {props.page.title}</DialogTitle>
		<DialogContent >
			<DialogContentText> 
				This action cannot be undone.</DialogContentText>
		</DialogContent>
		<DialogActions >
		<Button autoFocus  variant="contained" color="secondary" onClick={() => setMode("default")}
			>Cancel</Button>
		<Button variant="contained" color="alert" onClick={() => removeAPage}
			>Delete Lore Page</Button>
		</DialogActions>
        </Dialog>

		</Card>

	)
}

export default LoreSummaryCard;
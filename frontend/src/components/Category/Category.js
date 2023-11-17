import {useState,useEffect} from 'react';
import LoreSummaryCard from './../common/LoreSummaryCard';
import { useParams, useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import { getCategory,editCategory, removeCategory} from '../../actions/categoryActions';

//MATERIAL UI IMPORTS
import ImageCard from '../common/ImageCard';
import Button from '@mui/material/Button';
import { Box, Grid, Typography, Paper, Divider, Stack, DialogActions, DialogTitle, DialogContentText } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import UploadWidget from '../Cloudinary/UploadWidget';
import MultipleSelectChip from '../common/MultipleSelectChip';






const Category = (props) => {

	// Get token and links from "store" state with useSelector
	const worldid = useSelector(state => state.world.page.id)
	//const worldurl = useSelector(state => state.world.page.custom_url) // when transitioning from ids to urls
    const links = useSelector(state => state.category.page.lore_pages);
    const catpage = useSelector(state => state.category.page);
    const catlist = useSelector(state => state.category.list);
    const lorelist = useSelector(state => state.lore.list);
	
	// Use dispatcer from react-redux
	const dispatch = useDispatch();
	const navigate = useNavigate();

	//mode for page's State : default, edit, remove
	const [mode,setMode] = useState("default")
	const [editState,setEditState] = useState({
		...catpage
	})
	
	
	//ID RECIEVED FROM ROUTER URL
	let {worldurl, url}  = useParams();
	
	useEffect(() => {
		// Get page id based on url:
		if (catlist) {
			let found = false;
			for (let cat of catlist) {
				if (cat.custom_url === url) {
					// If find a match, dispatch getPage to update page state
					dispatch(getCategory(worldid,cat.id));
					found = true;
					break;
				}
			}
			if (!found) {
				navigate("/");
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[url,catlist])

	
	//display loading icon if the page is still waiting on server
	const [loading,setLoading] = useState(false);

	if (catpage.custom_url !== url && loading===false){
		setLoading (true);
	} else if (catpage.custom_url === url && loading === true) {
		setEditState({...catpage});
		setLoading(false)}
	
	
	 // Handle normal onChange events    
	 const onChange = (event) => {

        //custom url can be max 50 characters!
        if (event.target.name === "custom_url"&&event.target.value.length === 50) {
            return
        }
        setEditState((editState) => {
            return {
                ...editState,
                [event.target.name]:event.target.value
            }
        })
    }


	//HANDLE DELETING THE ENTIRE CATEGORY
	const removeCat = () => {
		dispatch(removeCategory(worldid,catpage.id));
		setMode("default");
		return;
	}
	
	//HANDLE SAVING THE EDIT OF CATEGORY
	const editCat = () => {
		let tempCategory = {...editState}
		//*REPLACE SPACES WITH UNDERLINE, MAKE THE TITLE AS URL IF NONE SPECIFIED
        //custom url can be max 50 characters! (thus, the SLICE command)
        tempCategory.custom_url = tempCategory.custom_url === ""? editState.title.slice(0,49).replace(/\s+/g, '_') : tempCategory.custom_url.replace(/\s+/g, '_')

		dispatch(editCategory(worldid,tempCategory));
		setMode("default");
	}

	//  change the state of the system, 
	// changing between "remove", "edit" and "default" mode
	let actionButtons;
	
	if (mode==="remove"){
		actionButtons = <>
		<Button size="small" disabled variant="contained" color="secondary" onClick={() => setMode("edit")}
			>Edit</Button>
		<Button size="small" disabled variant="contained" color="alert" onClick={() => setMode("remove")}
			>Delete Category</Button>
			</>}
	
	if(mode === "edit") {
		actionButtons = <>
		<Button size="small" variant="contained" color="secondary" onClick={() => setMode("default")}
			>Cancel</Button>
		<Button size="small" variant="contained" color="success" onClick={editCat}
			>Save</Button>
			</>}
	
	if (mode === "default"&&catpage.title!=="Uncategorised"){
		actionButtons = <>
		<Button size="small" variant="contained" color="secondary" onClick={() => setMode("edit")}
			>Edit</Button>
		<Button size="small" variant="contained" color="alert" onClick={() => setMode("remove")}
			>Delete Category</Button>
			</>}


	//Get one Lore Page from the list of all pages in the database based on ID
	const getLore = (id) => {
		for (const lore of lorelist){
			if (lore.id === id) return lore
		}
		//MATCH WAS NOT FOUND
		return "Lost Link";
	}

	//*LIST THE PAGES IN THIS CATEGORY
	let pages = <Typography sx={{p:2}} variant="body1">No Lore pages linked yet.</Typography>

	//if category has at least one link to a lore saved:
	if (links &&links.length>0){

		//THIS NEEDS TO BE MEMOISED, MAP MAKES RE-RENDERS EVERY CYCLE
		pages = links.map((id,index) => {
			//define an instance of lore page
			let page = getLore(id)
			
			return(
				<Grid key={index+page.id} item xs  >
				<LoreSummaryCard page={page} index={index} category={catpage} worldurl={worldurl}/>
				</Grid>
			)
		})
	}

	//Display the loading icon if state is loading
	pages = loading===false ? pages :<CircularProgress color="inherit" /> ;

	//*DEFAULT LAYOUT
	let content;
	if ((mode==="default"||"delete")&&catpage.title!=="Uncategorised"){
		content = 
		<>
		<Grid xs={12} sm={8} order={{xs:2,sm:1}}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant="lore">{catpage.title}</Typography>

		{/* DONT WRITE EMPTY HEADERS */}
		{catpage.description&&<Typography variant="h6">Description:</Typography>}
		<Typography variant="body1">{catpage.description}</Typography>
		{catpage.private_notes&&<Typography variant="h6">Notes:</Typography>}
		<Typography variant="body1">{catpage.private_notes}</Typography>
		
		</Container>
		</Grid>
		
		<Grid item xs  order={{xs:1,sm:2}} >
			<Stack direction="row" justifyContent="flex-end" spacing={1}>
				{actionButtons}
			</Stack>
			<br/>
			<ImageCard page={catpage}/>
		</Grid>
			</>
	}
	if(catpage.title==="Uncategorised"){
		content = 
		<>
		<Grid item xs={12} sm={8} order={{xs:2,sm:1}}>
		<Typography variant="lore">Uncategorised Lore</Typography>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
			<br/>
		<Typography variant="h5" color="secondary"><em>This is where all your Lore missing a category will be found.</em></Typography>
		</Container>
		</Grid>
		<Grid item xs={4} order={{xs:1,sm:2}} >
			<br/>
			<ImageCard page={catpage}/>
		</Grid>
			</>
	}

	//*LAYOUT IN EDIT MODE
	if (mode === "edit"){
		content = 
		<>
		<Grid item xs={12} sm={8} order={{xs:1,sm:1}}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant='loreSmall'>Edit Category</Typography>

		<TextField id="category-title" size='small' name="title" label="Title" required multiline maxRows={2}
                value={editState.title} onChange={onChange}/>
		<br/>
		<TextField id="category-description" size='small' name="description" label="Description" multiline maxRows={10}
                value={editState.description} onChange={onChange}/>
		<br/>
		<TextField id="category-private_notes" size='small' name="private_notes" label="Private Notes" multiline maxRows={4}
			value={editState.private_notes} onChange={onChange}/>
		<br/>
		<TextField id="category-custom_url" size='small' name="custom_url" label="Display URL as:" multiline maxRows={4}
                value={editState.custom_url} onChange={onChange}/>
		<br/>
		<MultipleSelectChip list={lorelist} label={"Lore"} state={editState} name="lore_pages" setState={setEditState}/>
		</Container>
		</Grid>
		<Grid  item  xs order={{xs:2,sm:2}} >
			<Box alignContent="flex-end">

			<Stack direction="row" justifyContent="flex-end" spacing={1}>
				{actionButtons}
			</Stack>
			<br/>
			<ImageCard page={editState}/>
			<UploadWidget setState={setEditState}/>
			</Box>
		</Grid>
			</>
	}
	return(
		<Paper elevation={3} sx={{ p:2}}>
	
		<Grid container  rowSpacing={2} >
			{content}
		</Grid>
		
		{/* <Container> */}


		<br/>
		<br/>
		<Divider/>
		<Typography variant='loreSmall' >Lore in this Category:</Typography>
		<br/>
		<br/>
		
		<Grid container spacing={3} >
			{pages}
		</Grid>
		{/* </Container> */}
			
		<Dialog fullWidth maxWidth='sm' open={mode==="remove"} onClose={()=>setMode("default")} aria-label="confirm-delete-dialog">
        <DialogTitle>
			Deleting category: {catpage.title}</DialogTitle>
		<DialogContent >
			<DialogContentText> 
				This action cannot be undone.</DialogContentText>
		</DialogContent>
		<DialogActions >
		<Button autoFocus  variant="contained" color="secondary" onClick={() => setMode("default")}
			>Cancel</Button>
		<Button variant="contained" color="alert" onClick={removeCat}
			>Delete Category</Button>
		</DialogActions>
        </Dialog>

	</Paper>

	)
}

export default Category;
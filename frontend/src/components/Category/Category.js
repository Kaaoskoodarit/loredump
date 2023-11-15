import {useState,useEffect} from 'react';
import LoreSummaryCard from './../common/LoreSummaryCard';
import { useParams } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import { getCategory,editCategory, removeCategory} from '../../actions/categoryActions';
import ImageCard from '../common/ImageCard';
import Button from '@mui/material/Button';
import { Grid, Typography, Paper, Divider, Stack, DialogActions, DialogTitle, DialogContentText } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';






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
	
	const [mode,setMode] = useState("default")
	
	
	//ID RECIEVED FROM ROUTER URL
	let {worldurl, url}  = useParams();
	
	useEffect(() => {
		// Get page id based on url:
		if (catlist) {
			for (let cat of catlist) {
				if (cat.custom_url === url) {
					// If find a match, dispatch getPage to update page state
					dispatch(getCategory(worldid,cat.id));
					break;
				}
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[url,catlist])
	
	
	const [loading,setLoading] = useState(false);

	if (catpage.custom_url !== url && loading===false){
		setLoading (true);
	} else if (catpage.custom_url === url && loading === true) {setLoading(false)}
	
	


	
	const removeCat = () => {
		dispatch(removeCategory(worldid,catpage.id));
		setMode("default");
		return;
	}
	
	const editCat = () => {
		dispatch(editCategory(worldid,catpage));
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
	
	if (mode === "default"){
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

	//LIST THE PAGES IN THIS CATEGORY
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


	return(
		<Paper elevation={3} sx={{ p:2}}>
		<Stack direction="row" justifyContent="flex-end" spacing={1}>
			{actionButtons}
		</Stack>
		<Grid container spacing={2} >
	

		<Grid item xs={12} sm={8}>
		<Typography variant="lore">{catpage.title}</Typography>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>

		<Typography variant="h6">Description:</Typography>
		<Typography variant="body1">{catpage.description}</Typography>
		<Typography variant="h6">Notes:</Typography>
		<Typography variant="body1">{catpage.private_notes}</Typography>
		
		</Container>
		</Grid>
		
		<Grid item xs >
			<br/>
		<ImageCard page={catpage}/>
		</Grid>
		
		</Grid>
		<Container>


		<br/>
		<br/>
		<Divider/>
		<Typography variant='loreSmall' >Lore in this Category:</Typography>
		<br/>
		<br/>
		
		<Grid container spacing={3} >
			{pages}
		</Grid>
		</Container>
			
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
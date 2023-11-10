import {useState} from 'react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import { useParams } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {removePage,editPage} from '../../actions/pageActions';
//import { useNavigate} from 'react-router-dom';
//import ManageLinks from '../ManageLinks';
import { getCategory} from '../../actions/categoryActions';
import { Grid, Typography, Paper, Divider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { Card, CardMedia, CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';





const Category = (props) => {
	// Set state of the component: indices of objects to be 
	// removed or edited. Only one can be other than -1 at a time
	const [state,setState] = useState({
		removeIndex:-1,
		editIndex:-1
	})


	
	// Get token and links from "store" state with useSelector
	const worldid = useSelector(state => state.world.page.id)
	//const worldurl = useSelector(state => state.world.page.custom_url) // when transitioning from ids to urls
    const links = useSelector(state => state.category.page.lore_pages);
    const catpage = useSelector(state => state.category.page);
    const catlist = useSelector(state => state.category.list);
    const lorelist = useSelector(state => state.lore.list);
	


	//mode:verbose
	
	// Use dispatcer from react-redux
	const dispatch = useDispatch();
	// use navigate from react-router-dom
	//const navigate = useNavigate();

	//VARIABLES FOR VIEWING IMAGES
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	  };
	
	  const handleClose = () => {
		setOpen(false);
	  };

	let image;
	if( catpage.image){
		image = 
			<Grid item xs={4}>
			<Card elevation={3} sx={{ p:1, maxWidth:300 }}>
				<CardActionArea onClick={handleClickOpen}>
				<CardMedia sx={{ height:200}} image={catpage.image} title={"Image for "+catpage.title}/>
				</CardActionArea>
				<Dialog open={open} onClose={handleClose} aria-label="image-dialog">
			<DialogContent maxWidth="1000" maxHeight="1000" >
				<img height='100%' width='100%' src={catpage.image} alt={""}/>
			</DialogContent>
				</Dialog> </Card> </Grid> 
		}
	 
	
	//ID RECIEVED FROM ROUTER URL
	let {worldurl, url}  = useParams();
	const [loading,setLoading] = useState("");

	if (catpage.custom_url !== url && loading===""){
		setLoading (<CircularProgress color="inherit" />);
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
	} else if (catpage.custom_url === url && loading !== "") {setLoading("")}
	
	// Function to change the state of the system, 
	// changing between "remove", "edit" and "normal" mode
	const changeMode = (mode,index) => {
		if(mode === "remove") {
			setState({
				removeIndex:index,
				editIndex:-1
			})
		}
		if(mode === "edit") {
			setState({
				removeIndex:-1,
				editIndex:index
			})
		}
		if(mode === "cancel") {
			setState({
				removeIndex:-1,
				editIndex:-1
			})
			// setManagelinks({
			// 	mode:"",
			// 	page:""
			//})
		}
	}


	//Handler for the clickable link buttons in Row component
	/*
	const handleNavigate = (id) => {
		dispatch(getPage(worldid,id));
		navigate("/api/worlds/"+worldid+"/lore_pages/"+id)
	}
	*/
	
	const removeAPage = (id) => {
		dispatch(removePage(worldid,id));
		changeMode("cancel");
		return;


		// removeLinkFromCategory(page,store)
		//setManagelinks({mode:"remove-page",page:page})
		
	}
	
	const editAPage = (page) => {
		console.log("EDITING")
		dispatch(editPage(worldid,page));
		changeMode("cancel");
	}

	//Get one Lore Page from the list of all pages in the database based on ID
	const getLore = (id) => {
		for (const lore of lorelist){
			if (lore.id === id) return lore
		}
		return id;
	}

	let pages = <tr><td>No Lore pages linked yet.</td></tr>

	//if category has at least one link to a lore saved:
	if (links &&links.length>0){

		//THIS NEEDS TO BE MEMOISED, MAP MAKES RE-RENDERS EVERY CYCLE
		pages = links.map((id,index) => {
			//define an instance of lore page
			let page = getLore(id)
			if(index === state.removeIndex) {
				return(
					<RemoveRow key={index+page.id} page={page} changeMode={changeMode} removePage={removeAPage}/>
				)
			}
			if(index === state.editIndex) {

				return(
					<EditRow key={index+page.id} page={page} changeMode={changeMode} editPage={editAPage}/>
				)
			}
			return(
				<Grid item xs={3}>
				<Row key={index+page.id} page={page} index={index} changeMode={changeMode}
				worldurl={worldurl}/>
				</Grid>
			)
		})
	}

	//Display the loading icon if state is loading
	pages = loading!=="" ? loading : pages

	// let managelinks_message = managelinks.mode!=="" ?
	// 	<ManageLinks mode ={managelinks.mode} page={managelinks.page}/> : ""

	return(
		<Paper elevation={3} sx={{ p:2}}>
		<Grid container spacing={2}>
		

		<Grid item xs={8}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant="lore">{worldurl}</Typography>
		<Typography variant="lore">{catpage.title}</Typography>

		<Typography variant="h6">Description:</Typography>
		<Typography variant="body1">{catpage.description}</Typography>
		<Typography variant="h6">Notes:</Typography>
		<Typography variant="body1">{catpage.private_notes}</Typography>
		
		</Container>
		</Grid>
		
		{image}
		
		</Grid>
		<Container>
		<br/>
		<br/>
		<Divider/>
		<Typography variant='loreSmall' >Lore in this Category:</Typography>
		<br/>
		<br/>
		</Container>
		
		<Grid container spacing={3}>
			{pages}
		</Grid>
			

	</Paper>

	)
}

export default Category;
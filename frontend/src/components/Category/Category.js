import {useEffect, useState} from 'react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import { useParams } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {getPage,removePage,editPage} from '../../actions/pageActions';
import { useNavigate} from 'react-router-dom';
//import ManageLinks from '../ManageLinks';
import {addLinkToCategory, removeLinkFromCategory} from '../ManageLinks_func';
import { getCategory, getCategoryList } from '../../actions/categoryActions';
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

	// const [managelinks,setManagelinks] = useState({
	// 	mode:"",
	// 	page:""
	// })
	
	// Get token and links from "store" state with useSelector
    const token = useSelector(state => state.login.token);
    const links = useSelector(state => state.category.page.links);
    const catpage = useSelector(state => state.category.page);
    const lorelist = useSelector(state => state.page.list);
	const store = useSelector(state => state)

	//mode:verbose
	
	// Use dispatcer from react-redux
	const dispatch = useDispatch();
	// use navigate from react-router-dom
	const navigate = useNavigate();

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
				<img height='100%' width='100%' src={catpage.image}/>
			</DialogContent>
				</Dialog> </Card> </Grid> 
		}
	 
	
	//ID RECIEVED FROM ROUTER URL
	let { id } = useParams();
	const [loading,setLoading] = useState("");

	if (catpage.id !== id && loading===""){
		setLoading (<CircularProgress color="inherit" />);
		dispatch(getCategory(token,id));
	} else if (catpage.id ===id &&loading!=="") {setLoading("")}
	
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
	const handleNavigate = (id) => {
		dispatch(getPage(token,id));
		navigate("/lorepage/"+id)
	}
	
	const removeAPage = (page) => {
		//dispatch(removePage(token,page.id))
		console.log("removePage");
		dispatch(removeLinkFromCategory(page,store))
		changeMode("cancel");
		return;


		// removeLinkFromCategory(page,store)
		//setManagelinks({mode:"remove-page",page:page})
		
	}
	
	const editAPage = (page) => {
		console.log("EDITING")
		dispatch(editPage(token,page));
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
				<Row key={index+page.id} page={page} index={index} changeMode={changeMode}/>
				</Grid>
			)
		})
	
	}
	// let managelinks_message = managelinks.mode!=="" ?
	// 	<ManageLinks mode ={managelinks.mode} page={managelinks.page}/> : ""

	return(
		<Paper elevation={3} sx={{ p:2}}>
		<Grid container spacing={2}>
		{loading}
		

		<Grid item xs={8}>
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
		<Typography variant="lore">{catpage.title}</Typography>

		<Typography variant="h6">Description:</Typography>
		<Typography variant="body1">{catpage.description}</Typography>
		<Typography variant="h6">Notes:</Typography>
		<Typography variant="body1">{catpage.notes}</Typography>
		
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
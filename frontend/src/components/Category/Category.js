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
import { Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';




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
				<Grid item xs={4}>
				<Row key={index+page.id} page={page} index={index} changeMode={changeMode}/>
				</Grid>
			)
		})
	
	}
	// let managelinks_message = managelinks.mode!=="" ?
	// 	<ManageLinks mode ={managelinks.mode} page={managelinks.page}/> : ""

	return(
		<div>
			{/* {managelinks_message} */}
		<Typography variant='h5' >{catpage.title}</Typography>
		

		<p>Image: {catpage.image}</p>
		<p>Description: {catpage.description}</p>
		<p>Notes: {catpage.notes}</p>
		<br/>
		<Typography variant='h5' >Lore in this Category:</Typography>
		<Grid container spacing={3}>
			{pages}
		</Grid>
			

		</div>
	)
}

export default Category;
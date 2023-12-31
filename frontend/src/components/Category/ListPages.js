import {useState} from 'react';
import LoreSummaryCard from './../common/LoreSummaryCard';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {removePage,editPage} from '../../actions/pageActions';
import {useParams} from 'react-router-dom';
import { Grid } from '@mui/material';



const ListPages = (props) => {
	// Set state of the component: indices of objects to be 
	// removed or edited. Only one can be other than -1 at a time
	const [state,setState] = useState({
		removeIndex:-1,
		editIndex:-1
	})
	
	// Get token and list from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			worldid:state.world.page.id,
			list:state.lore.list
		}
	})
	//console.log("Listpages: world ID",appState.worldid);
	
	// Use dispatcer from react-redux
	const dispatch = useDispatch();

	let {worldurl}  = useParams();

	
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
		}
	}
	
	const removeAPage = (id) => {
		dispatch(removePage(appState.worldid,id));
		changeMode("cancel");
	}
	
	const editAPage = (page) => {
		console.log("EDITING")
		dispatch(editPage(appState.worldid,page));
		changeMode("cancel");
	}

	const pages = appState.list.map((page,index) => {
		if(index === state.removeIndex) {
			return(
				<RemoveRow key={page.id} page={page} changeMode={changeMode} removePage={removeAPage}/>
			)
		}
		if(index === state.editIndex) {
		console.log("make editrow")

			return(
				<EditRow key={page.id} page={page} changeMode={changeMode} editPage={editAPage}/>
			)
		}
		return(
			<Grid key={index+page.id} item xs minWidth="240">
			<LoreSummaryCard page={page} index={index} worldurl={worldurl}/>
			</Grid>

		)
	})
	return(
		<Grid container spacing={2}>
			{pages}
		</Grid>


	)
}

export default ListPages;
import {useState} from 'react';
import Row from './Row';
import Box from '@mui/material/Box';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {getPage,removePage,editPage} from '../../actions/pageActions';
import {Navigate,RedirectFunction, useNavigate} from 'react-router-dom';
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
			token:state.login.token,
			list:state.page.list
		}
	})
	
	// Use dispatcer from react-redux
	const dispatch = useDispatch();
	// use navigate from react-router-dom
	const navigate = useNavigate();
	
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

	// //Handler for the clickable link buttons in Row component
	// const handleNavigate = (id) => {
	// 	dispatch(getPage(appState.token,id));
	// 	navigate("/lorepage/"+id)
	// }
	
	const removeAPage = (id) => {
		dispatch(removePage(appState.token,id));
		changeMode("cancel");
	}
	
	const editAPage = (page) => {
		console.log("EDITING")
		dispatch(editPage(appState.token,page));
		changeMode("cancel");
	}
	
	const Item = <></>;

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
			<Grid item xs={4}>
			<Row key={page.id} page={page} index={index} changeMode={changeMode}/>
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
import {useState} from 'react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {getPage,removePage,editPage} from '../../actions/pageActions';
import {useNavigate} from 'react-router-dom';



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

	//Handler for the clickable link buttons in Row component
	const handleNavigate = (id) => {
		dispatch(getPage(appState.worldid,id));
		navigate("/lorepage/"+id)
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
				<RemoveRow key={page.id} page={page} handleNavigate={handleNavigate} changeMode={changeMode} removePage={removeAPage}/>
			)
		}
		if(index === state.editIndex) {
		console.log("make editrow")

			return(
				<EditRow key={page.id} page={page} changeMode={changeMode} editPage={editAPage}/>
			)
		}
		return(
			<Row key={page.id} page={page} index={index} handleNavigate={handleNavigate} changeMode={changeMode}/>
		)
	})
	return(
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Title</th>
					<th>Image</th>
					<th>Summary</th>
					<th>Categories</th>
					<th>Edit</th>
					<th>Remove</th>
				</tr>
			</thead>
			<tbody>
			{pages}
			</tbody>
		</table>
	)
}

export default ListPages;
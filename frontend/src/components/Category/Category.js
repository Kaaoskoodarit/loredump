import {useState} from 'react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {getPage,remove,edit} from '../../actions/pageActions';
import {Navigate,RedirectFunction, useNavigate} from 'react-router-dom';
import LorePage from '../LorePage/LorePage';



const Category = (props) => {
	// Set state of the component: indices of objects to be 
	// removed or edited. Only one can be other than -1 at a time
	const [state,setState] = useState({
		removeIndex:-1,
		editIndex:-1
	})
	
	// Get token and links from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			token:state.login.token,
			links:state.category.page.links
		}
	})
	const token = appState.token
	const links = appState.links
	
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
		dispatch(getPage(token,id));
		navigate("/lorepage/"+id)
	}
	
	const removePage = (id) => {
		dispatch(remove(token,id));
		changeMode("cancel");
	}
	
	const editPage = (page) => {
		console.log("EDITING")
		dispatch(edit(token,page));
		changeMode("cancel");
	}

	let pages = <tr><td>No Lore pages linked yet.</td></tr>
	if (links.length>0){
		pages = links.map((page,index) => {
			if(index === state.removeIndex) {
				return(
					<RemoveRow key={page.id} page={page} handleNavigate={handleNavigate} changeMode={changeMode} removePage={removePage}/>
				)
			}
			if(index === state.editIndex) {
			console.log("make editrow")

				return(
					<EditRow key={page.id} page={page} changeMode={changeMode} editPage={editPage}/>
				)
			}
			return(
				<Row key={page.id} page={page} index={index} handleNavigate={handleNavigate} changeMode={changeMode}/>
			)
		})
	}
	return(
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Title</th>
					<th>Image</th>
					<th>Summary</th>
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

export default Category;
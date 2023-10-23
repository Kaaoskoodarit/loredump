import {useState} from 'react';
import Row from '../components/Row';
import RemoveRow from '../components-old//RemoveRow';
import EditRow from '../components-old//EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {remove,edit} from '../actions/pageActions';



const Category = (props) => {
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
	
	const removePage = (id) => {
		dispatch(remove(appState.token,id));
		changeMode("cancel");
	}
	
	const editPage = (page) => {
		dispatch(edit(appState.token,page));
		changeMode("cancel");
	}
	
	const pages = appState.list.map((page,index) => {
		if(index === state.removeIndex) {
			return(
				<RemoveRow key={page.id} page={page} changeMode={changeMode} removePage={removePage}/>
			)
		}
		if(index === state.editIndex) {
			return(
				<EditRow key={page.id} page={page} changeMode={changeMode} editPage={editPage}/>
			)
		}
		return(
			<Row key={page.id} page={page} index={index} changeMode={changeMode}/>
		)
	})
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
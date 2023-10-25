import {useState} from 'react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {remove,edit} from '../actions/shoppingActions';

// Component displaying the shopping list
const ShoppingList = (props) => {
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
			list:state.shopping.list
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
	
	// Function that dispatches a remove action to the reducer
	const removeItem = (id) => {
		dispatch(remove(appState.token,id));
		changeMode("cancel");
	}
	// Function that dispatches an edit action to the reducer
	const editItem = (item) => {
		dispatch(edit(appState.token,item));
		changeMode("cancel");
	}
	
	// Go through each item in a list, and pick a component to render
	// based on the item's current state. Makes a list of components
	const items = appState.list.map((item,index) => {
		if(index === state.removeIndex) {
			return(
				<RemoveRow key={item.id} item={item} changeMode={changeMode} removeItem={removeItem}/>
			)
		}
		if(index === state.editIndex) {
			return(
				<EditRow key={item.id} item={item} changeMode={changeMode} editItem={editItem}/>
			)
		}
		return(
			<Row key={item.id} item={item} index={index} changeMode={changeMode}/>
		)
	})
	return(
	// Render the list of items, with a header on top
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Type</th>
					<th>Count</th>
					<th>Price</th>
					<th>Remove</th>
					<th>Edit</th>
				</tr>
			</thead>
			<tbody>
			{items}
			</tbody>
		</table>
	)
}

export default ShoppingList;
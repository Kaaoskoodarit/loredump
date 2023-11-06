import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {add} from '../actions/pageActions';

// Component that shows the form to add new items
const ShoppingForm = (props) => {
	
	// Set state of the component: basically properties of an item
	// to be added
	const [state,setState] = useState({
		type:"",
		count:0,
		price:0
	})
	// Get a token from the "store"
	const token = useSelector(state => state.login.token);
	// Use dispatcher from react-redux
	const dispatch = useDispatch();
	
	// Function for "onChange" events
	const onChange = (event) => {
		setState((state) => {
			return {
				...state,
				[event.target.name]:event.target.value
			}
		})
	}
	// Function for "onSubmit" events
	const onSubmit = (event) => {
		event.preventDefault();
		let item = {
			...state
		}
		// Add an itme to the list of items
		dispatch(add(token,item));
		// Set state of the component back to default
		setState({
			type:"",
			count:0,
			price:0
		})
	}
	
	return(
		<div style={{
			backgroundColor:"lightgreen",
			margin:"auto",
			width:"40%",
			textAlign:"center"
		}}>
			<form className="mb-5" onSubmit={onSubmit}>
				<label htmlFor="type" className="form-label">Type</label>
				<input type="text"
						name="type"
						id="type"
						className="form-control"
						onChange={onChange}
						value={state.type}/>
				<label htmlFor="count" className="form-label">Count</label>
				<input type="number"
						name="count"
						id="count"
						className="form-control"
						onChange={onChange}
						value={state.count}/>
				<label htmlFor="price" className="form-label">Price</label>
				<input type="number"
						name="price"
						id="price"
						step="0.01"
						className="form-control"
						onChange={onChange}
						value={state.price}/>
				<input type="submit" className="btn btn-primary" value="Add"/>
			</form>
		</div>
	)
	
}

export default ShoppingForm;
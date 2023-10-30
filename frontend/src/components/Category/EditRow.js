import {useState} from 'react';

// Component that shows an "edit mode" row, with "cancel" and "confirm" buttons
const EditRow = (props) => {
	// Set state of the component (properties of page to be edited)
	const [state,setState] = useState({
		title:props.page.title,
		image:props.page.image,
		summary:props.page.summary
	})
	
	// Function for "onChange" events
	const onChange = (event) => {
		setState((state) => {
			return {
				...state,
				[event.target.name]:event.target.value
			}
		})
	}
	// Function for "onChange" events
	const savePage = () => {
		let page = {
			...state,
			id:props.page.id
		}
		// Call "editItem" function given as a prop!
		props.editPage(page)
	}
	
	return(
		<tr>
			<td><input type="text"
						id="title"
						name="title"
						className="form-control"
						onChange={onChange}
						value={state.title}/></td>
			<td><input type="url"
						id="image"
						name="image"
						className="form-control"
						onChange={onChange}
						value={state.image}/></td>
			<td><input type="text"
						id="summary"
						name="summary"
						className="form-control"
						onChange={onChange}
						value={state.summary}/></td>
			<td><button onClick={savePage}
				className="btn btn-success"
				>Save</button></td>
			<td><button onClick={() => props.changeMode("cancel")}
				className="btn btn-danger"
				>Cancel</button></td>
		</tr>
	)
}

export default EditRow;
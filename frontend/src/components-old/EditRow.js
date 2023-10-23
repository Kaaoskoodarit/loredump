import {useState} from 'react';

const EditRow = (props) => {
	
	const [state,setState] = useState({
		type:props.item.type,
		count:props.item.count,
		price:props.item.price
	})
	
	const onChange = (event) => {
		setState((state) => {
			return {
				...state,
				[event.target.name]:event.target.value
			}
		})
	}
	
	const saveItem = () => {
		let item = {
			...state,
			id:props.item.id
		}
		props.editItem(item)
	}
	
	return(
		<tr>
			<td><input type="text"
						id="type"
						name="type"
						className="form-control"
						onChange={onChange}
						value={state.type}/></td>
			<td><input type="number"
						id="count"
						name="count"
						className="form-control"
						onChange={onChange}
						value={state.count}/></td>
			<td><input type="number"
						id="price"
						name="price"
						step="0.01"
						className="form-control"
						onChange={onChange}
						value={state.price}/></td>
			<td><button onClick={saveItem}
				className="btn btn-success"
				>Save</button></td>
			<td><button onClick={() => props.changeMode("cancel")}
				className="btn btn-danger"
				>Cancel</button></td>
		</tr>
	)
}

export default EditRow;
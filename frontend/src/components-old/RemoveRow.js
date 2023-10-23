const RemoveRow = (props) => {
	
	return(
		<tr>
			<td>{props.item.type}</td>
			<td>{props.item.count}</td>
			<td>{props.item.price}</td>
			<td><button onClick={() => props.changeMode("cancel")}
				className="btn btn-danger"
				>Cancel</button></td>
			<td><button onClick={() => props.removeItem(props.item.id)}
				className="btn btn-success"
				>Confirm</button></td>
		</tr>
	)
}

export default RemoveRow;
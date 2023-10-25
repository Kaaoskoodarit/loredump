const Row = (props) => {
	
	return(
		<tr>
			<td>{props.item.type}</td>
			<td>{props.item.count}</td>
			<td>{props.item.price}</td>
			<td><button onClick={() => props.changeMode("remove",props.index)}
				className="btn btn-primary"
				>Remove</button></td>
			<td><button onClick={() => props.changeMode("edit",props.index)}
				className="btn btn-primary"
				>Edit</button></td>
		</tr>
	)
}

export default Row;
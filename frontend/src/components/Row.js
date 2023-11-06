// Component that shows a normal list entry, with "remove" and "edit" buttons
const Row = (props) => {
	

	//className="nav-link"
	return(
			
		<tr>
			<td><button onClick={() => props.handleNavigate(props.page.id)}
				className="btn btn-primary"
				>{props.page.title}</button>
			</td>
			<td>{props.page.image}</td>
			<td>{props.page.summary}</td>
			<td><button onClick={() => props.changeMode("edit",props.index)}
				className="btn btn-primary"
				>Edit</button></td>
			<td><button onClick={() => props.changeMode("remove",props.index)}
				className="btn btn-primary"
				>Remove</button></td>
			
		</tr>
		
	)
}

export default Row;
// Component that shows a "remove mode" row, with "cancel" and "confirm" buttons
const RemoveRow = (props) => {
	
	return(
		<tr>
			<td><button onClick={() => props.handleNavigate(props.page.id)}
				className="btn btn-primary"
				>{props.page.title}</button>
			</td>
			<td>{props.page.image}</td>
			<td>{props.page.summary}</td>
			<td><button onClick={() => props.removePage(props.page)}
				className="btn btn-danger"
				>Confirm Remove</button></td>
			<td><button onClick={() => props.changeMode("cancel")}
				className="btn btn-secondary"
				>Cancel</button></td>
			
		</tr>
	)
}

export default RemoveRow;
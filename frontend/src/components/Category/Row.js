// Component that shows a normal list entry, with "remove" and "edit" buttons
const Row = (props) => {
	const categories = props.page.categories.map((i)=><p>{i}</p>)
	const image = (props.page.image!=="")? 
		<img key={props.page.image} src={props.page.image} style={{'maxWidth':100, 'maxHeight':100}} alt={"Image for "+props.page.title}></img> : ""
	

	//className="nav-link"
	return(
			
		<tr>
			<td><button onClick={() => props.handleNavigate(props.page.id)}
				className="btn btn-primary"
				>{props.page.title}</button>
			</td>
			<td>{image}</td>
			<td>{props.page.summary}</td>
			<td>{categories}</td>
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
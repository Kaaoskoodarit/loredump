// Component that shows a normal list entry, with "remove" and "edit" buttons
const Row = (props) => {
	//console.log("Row: props.page",props.page)
	// const categories = props.page.categories.map((category,i)=><p key={props.page.title+i+category}>{category}</p>)
	const categories =<p>Categories</p>
	const image = (props.page.image!=="")? 
		<img key={props.page+props.page.image} src={props.page.image} style={{'maxWidth':100, 'maxHeight':100}} alt={"Image for "+props.page.title}></img> : ""
	

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
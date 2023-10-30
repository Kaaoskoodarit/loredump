import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {getCategory} from '../../actions/categoryActions';
import { useNavigate, Link } from 'react-router-dom';

//page: list, page, error


const LorePage = (props) => {
	// Get token and list from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			token:state.login.token,
            page:state.page.page,
			categorylist: state.category.list
		}
	})
    const page = appState.page
	const categorylist = appState.categorylist

	const [errorState,setErrorState] = useState(0)


    // Use dispatcer from react-redux
	const dispatch = useDispatch();
	// use navigate from react-router-dom
	const navigate = useNavigate();
	
	
	// //This kinda infiniloops oops
    // const loadCategory = (id) => {
	// 	console.log("got catpaged")
    //     dispatch(getCategory(appState.token,id));
    // }


    // const removePage = (id) => {
	// 	dispatch(remove(appState.token,id));
	// }

    // const editPage = (page) => {
	// 	dispatch(edit(appState.token,page));
	// }


	//Handler for the clickable link buttons in Row component
	const handleNavigate = (id) => {
		console.log("Handlenavigate ",errorState )

		if (!id){
			console.log("No Category found. Navigating to Home")
			navigate("/")
		} else {
			setErrorState(errorState+1)
			if(errorState<10){

			//The actual code:::
			console.log("Navigating to category id",id)
			dispatch(getCategory(appState.token,id));
			navigate("/category/"+id)


		} else console.log("Over 10 Get category attempts!")
		}
	}
    // const pages = appState.page.map((page,index) => {
	// 	// if(index === state.removeIndex) {
	// 	// 	return(
	// 	// 		<RemoveRow key={page.id} page={page} changeMode={changeMode} removePage={removePage}/>
	// 	// 	)
	// 	// }
	// 	// if(index === state.editIndex) {
	// 	// 	return(
	// 	// 		<EditRow key={page.id} page={page} changeMode={changeMode} editPage={editPage}/>
	// 	// 	)
	// 	// }
	// 	return(
	// 		<Row key={page.id} page={page} index={index}/>
	// 	)
	// })
    // const categoryList = page.categories.map((category) => <h3>{category}</h3>)

	

	const getCategoryTitle = (id) => {
		for(let i = 0;i<categorylist.length;i++) {
			if(categorylist[i].id === id) {
				return categorylist[i].title;
			}
		}
		return id;
	}
	let categories_listed = page.categories.map((id,index)=>{
		let categoryTitle = getCategoryTitle(id)
		return <td key={id}>
			{index}:
			<button onClick={() => handleNavigate(id)}
			className="btn btn-primary"
			>{categoryTitle}</button>
			</td>}
		)

	return(
        <div>
            {/* {categoryList} */}
            {/* <Link to category */}
		
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Creator, id (TEST DATA)</th>
					<th>Title</th>
					<th>Image</th>
					<th>Summary</th>
					<th>Description</th>
					<th>Relationships</th>
					<th>Notes</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
            <tr>
                <td>{page.creator} {page.id}</td>
                <td>{page.title}</td>
                <td>{page.image}</td>
                <td>{page.summary}</td>
                <td>{page.description}</td>
                {/* <td>{page.relationships}</td> */}
                <td>TBD</td>
                <td>{page.notes}</td>
            </tr>
			<tr><td>Categories:</td>
				{categories_listed}
			</tr>
			</tbody>
		</table>
        </div>
	)
}
export default LorePage;
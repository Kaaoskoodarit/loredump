import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {getCategory} from '../../actions/categoryActions';
import { useNavigate } from 'react-router-dom';

//page: list, page, error


const LorePage = (props) => {

	// Get token and list from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			worldid:state.world.page.id,
            page:state.lore.page,
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
	

	//IMAGES
	const default_img = 'https://media.discordapp.net/attachments/1161992163765256203/1169189304220782662/image.png?ex=65547f64&is=65420a64&hm=32e108ff3fe3bb4e9bb89feed07a87015edb99fcc6a8f1d1ecc6b2ae8d4f0017&='
	const image = (page.image !== 'error.jpg' && page.image !== "") ? page.image : default_img


	
	// //This kinda infiniloops oops
    // const loadCategory = (id) => {
	// 	console.log("got catpaged")
    //     dispatch(getCategory(appState.token,id));
    // }
	

    // const removeAPage = (id) => {
	// 	dispatch(removePage(appState.token,id));
	// }

    // const editAPage = (page) => {
	// 	dispatch(editPage(appState.token,page));
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
				dispatch(getCategory(appState.worldid,id));
				navigate("/api/worlds/"+appState.worldid+"/category/"+id)


			} else console.log("Over 10 Get category attempts!")
		}
	}

	const getCategoryTitle = (id) => {
		for (const category of categorylist){
			if (category.id === id) return category.title
		}
		return id;
	}

	let categories_listed;
	if(page.categories){
		categories_listed = page.categories.map((id,index)=>{
			let categoryTitle = getCategoryTitle(id)
			return <td key={index+id}>
				{index}:
				<button onClick={() => handleNavigate(id)}
				className="btn btn-primary"
				>{categoryTitle}</button>
				</td>}
			)
	}

	return(
        <div>
            {/* {categoryList} */}
            {/* <Link to category */}
		<h2>{page.title}</h2>

		<img key={image} src={image} style={{'maxWidth':200, 'maxHeight':200}} alt={"Image for "+page.title}></img>

		<p id="image-desc" className="form-text">
                    Image link: {page.image}
                    </p>
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Creator, id (TEST DATA)</th>
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
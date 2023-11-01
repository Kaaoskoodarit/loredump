import {useState} from 'react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {getPage,removePage,editPage} from '../../actions/pageActions';
import { useNavigate} from 'react-router-dom';
import { getCategoryList } from '../../actions/categoryActions';
import { addLink,removeLink } from '../ManageLinks';



const Category = (props) => {
	// Set state of the component: indices of objects to be 
	// removed or edited. Only one can be other than -1 at a time
	const [state,setState] = useState({
		removeIndex:-1,
		editIndex:-1
	})
	
	// Get token and links from "store" state with useSelector
    const token = useSelector(state => state.login.token);
    const links = useSelector(state => state.category.page.links);
    const catpage = useSelector(state => state.category.page);
    const lorelist = useSelector(state => state.page.list);
    const categorylist = useSelector(state => state.category.list);



	//mode:verbose
	
	// Use dispatcer from react-redux
	const dispatch = useDispatch();
	// use navigate from react-router-dom
	const navigate = useNavigate();
	
	// Function to change the state of the system, 
	// changing between "remove", "edit" and "normal" mode
	const changeMode = (mode,index) => {
		if(mode === "remove") {
			setState({
				removeIndex:index,
				editIndex:-1
			})
		}
		if(mode === "edit") {
			setState({
				removeIndex:-1,
				editIndex:index
			})
		}
		if(mode === "cancel") {
			setState({
				removeIndex:-1,
				editIndex:-1
			})
		}
	}

	//Handler for the clickable link buttons in Row component
	const handleNavigate = (id) => {
		dispatch(getPage(token,id));
		navigate("/lorepage/"+id)
	}
	
	const removeAPage = (page,category_ids) => {
		dispatch(removePage(token,page.id));
		dispatch(getCategoryList(token,"verbose"))
        
        // iterate through categories in the list
        for (let thiscategory of categorylist)
            if (category_ids.includes(thiscategory.id)) {
				
				removeLink(page,thiscategory)
				//remove page link from templinks
			}
             
		changeMode("cancel");
	}
	
	const editAPage = (page) => {
		console.log("EDITING")
		dispatch(editPage(token,page));
		changeMode("cancel");
	}

	//Get one Lore Page from the list of all pages in the database based on ID
	const getLore = (id) => {
		for (const lore of lorelist){
			if (lore.id === id) return lore
		}
		return id;
	}

	let pages = <tr><td>No Lore pages linked yet.</td></tr>

	//if category has at least one link to a lore saved:
	if (links &&links.length>0){
		pages = links.map((id,index) => {
			//define an instance of lore page
			let page = getLore(id)
			if(index === state.removeIndex) {
				return(
					<RemoveRow key={page.id} page={page} handleNavigate={handleNavigate} changeMode={changeMode} removePage={removeAPage}/>
				)
			}
			if(index === state.editIndex) {

				return(
					<EditRow key={page.id} page={page} changeMode={changeMode} editPage={editAPage}/>
				)
			}
			return(
				<Row key={page.id} page={page} index={index} handleNavigate={handleNavigate} changeMode={changeMode}/>
			)
		})
	}
	return(
		<div>
		<h2>{catpage.title}</h2>
		<p>Image: {catpage.image}</p>
		<p>Description: {catpage.description}</p>
		<p>Notes: {catpage.notes}</p>
		<br/>
		<h3>Links to Lore in this Category:</h3>
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Title</th>
					<th>Image</th>
					<th>Summary</th>
					<th>Edit</th>
					<th>Remove</th>
				</tr>
			</thead>
			<tbody>
			{pages}
			</tbody>
		</table>
		</div>
	)
}

export default Category;
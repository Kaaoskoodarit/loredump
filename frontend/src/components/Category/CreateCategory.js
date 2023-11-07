import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {addPage,getPage} from '../../actions/pageActions';
import { useNavigate } from 'react-router-dom';
import AssignCategories from './AssignCategories'

const CreateCategory = (props) => {
	// Set state for page
    //NIMEÄ UUDELLEEN STATE
	const [state,setState] = useState({
		title:"",
        custom_url:"",         // custom_url = title
		image:"",
        description:"",
        private_notes:"",
		lore_pages:[]            
	})

    // Get token and categorystate from the store
    const worldid = useSelector(state => state.world.page.id);
    //const worldurl = useSelector(state => state.world.page.custom_url);
    const categorystate = useSelector(state => state.category.page);

    // Use dispatch and navigate
    const dispatch = useDispatch();
    const navigate = useNavigate();

   
    // Handle normal onChange events    
    const onChange = (event) => {
        setState((state) => {
            return {
                ...state,
                [event.target.name]:event.target.value
            }
        })
    }

    //OnChange function specifically for Categories
    const onCatChange = (event) => {

        let tempArr =state.categories
        //event target = Select html element, ID HAS to be the index of the row
        tempArr[event.target.id] = event.target.value
        setState(() => {
            return{ 
                ...state,
                [event.target.name]:tempArr
               }
            })

    }

    
    // Handle onSubmit event
    const onSubmit = (event) => {
        event.preventDefault();
        // Add relationships to state
        state.relationships.push(relState)
        let page = {
            ...state,
            creator: props.user
        }
        // Add the new page to the database
        dispatch(addPage(worldid,page));
        // Redirect to the new page (getPage maybe redundant? test after merge!)
        dispatch(getPage(worldid,categorystate.id));
        navigate("/api/worlds/"+worldid+"/category/"+categorystate.id);
        // Reset the state of the page and relationships
        setState({
            title:"",
            custom_url:"",
            image:"",
            description:"",
            private_notes:"",
            lore_pages:[]
        })

    }

    return (
        <>
        <div style={{
			margin:"auto",
			width:"40%",
			textAlign:"left"
		}}>
            <form className="mb-5" onSubmit={onSubmit}>
				<label htmlFor="title" className="form-label">Title</label>
				<input type="text"
						name="title"
						id="title"
						className="form-control"
						onChange={onChange}
						value={state.title}/>
                    <div id="title-help" className="form-text">
                    This will be the title of your Category!
                    </div>
                <br/>
                <br/>
                <label htmlFor="image" className="form-label">Image link</label>
				<input type="url"
						name="image"
						id="image"
						className="form-control"
						onChange={onChange}
						value={state.image}/>
                <label htmlFor="summary" className="form-label">Summary</label>
				<input type="text"
						name="summary"
						id="summary"
						className="form-control"
						onChange={onChange}
						value={state.summary}/>
                <label htmlFor="description" className="form-label">Description</label>
				<input type="text"
						name="description"
						id="description"
						className="form-control"
						onChange={onChange}
						value={state.description}/>
                <label htmlFor="notes" className="form-label">Private Notes</label>
				<input type="text"
						name="notes"
						id="notes"
						className="form-control"
						onChange={onChange}
						value={state.private_notes}/>
                <select name={"categories"}
                            id={index}
                            className="form-select"
                            aria-label="Select Categories"
                            onChange={onCatChange}>
                        <option key={"selected"} value={state.categories[index]}>{selectedText}</option>
                </select>
                <br/>
                <input type="submit" className="btn btn-primary" value="Create new Lore Page"/>
            </form>
        </div>
         </>
    )
	
}

export default CreateCategory;
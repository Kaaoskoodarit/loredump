import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {add,getPage} from '../actions/pageActions';
import Relationships from './Relationships';
import { useNavigate } from 'react-router-dom';
import {CategoryRows} from './CategoryRows'
import {getCategoryList} from '../actions/categoryActions';

const AddLorePage = (props) => {
	// Set state for page
    //NIMEÄ UUDELLEEN STATE
	const [state,setState] = useState({
		title:"",
		categories:["Uncategorised"],
		image:"",
        summary:"",
        description:"",
        relationships:[],
        notes:""
	})

    // Set state for relationships
    const [relState,setRelState] = useState({
        reltype:"",
        target:""
    })

    // Get token and pagestate from the store
    const token = useSelector(state => state.login.token);
    const pagestate = useSelector(state => state.page.page);

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
        // update list of categories
        dispatch(getCategoryList(token));
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

    //OnChange function specifically for Relationships
    const onRelChange = (event) => {
        setRelState((relState) => {
            return {
                ...relState,
                [event.target.name]:event.target.value
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
        dispatch(add(token,page));
        // Redirect to the new page
        dispatch(getPage(token,pagestate.id));
        navigate("/lorepage/"+pagestate.id);
        // Reset the state of the page and relationships
        setState({
            title:"",
            categories:[],
            image:"",
            summary:"",
            description:"",
            relationships:[],
            notes:""
        })
        setRelState({
            reltype:"",
            target:""
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
                    This will be the title of your Lore Page!
                    </div>
                <CategoryRows state={state} setState={setState} onChange={onCatChange}/>
                <br/>
                <br/>
                <label htmlFor="image" className="form-label">Image link</label>
				<input type="text"
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
                <Relationships onChange={onRelChange} relationships={relState}/> 
                <label htmlFor="notes" className="form-label">Private Notes</label>
				<input type="text"
						name="notes"
						id="notes"
						className="form-control"
						onChange={onChange}
						value={state.notes}/>
                <br/>
                <input type="submit" className="btn btn-primary" value="Create new Lore Page"/>
            </form>
        </div>
         </>
    )
	
}

export default AddLorePage;
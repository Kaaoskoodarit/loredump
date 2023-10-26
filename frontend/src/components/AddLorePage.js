import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {add,getPage} from '../actions/pageActions';
import Relationships from './Relationships';
import {useNavigate} from 'react-router-dom';

const AddLorePage = (props) => {
	
	const [state,setState] = useState({
		title:"",
		categories:["Uncategorised"],
		image:"",
        summary:"",
        description:"",
        relationships:[],
        notes:""
	})

    const [relState,setRelState] = useState({
        reltype:"",
        target:""
    })

    const token = useSelector(state => state.login.token);
    const pagestate = useSelector(state => state.page.page);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const defaultCategories = ["Uncategorised","Characters","NPCs","Locations","Dates"]

    let categories = []
    defaultCategories.map(category => {
        categories.push(<option  key={category} value={category.toLocaleLowerCase()}>{category}</option>)
        return;
    });
        
    const onChange = (event) => {
        setState((state) => {
            return {
                ...state,
                [event.target.name]:event.target.value
            }
        })
    }

    const onRelChange = (event) => {
        setRelState((relState) => {
            return {
                ...relState,
                [event.target.name]:event.target.value
            }
        })
    }
    

    const onSubmit = (event) => {
        event.preventDefault();
        state.relationships.push(relState)
        let page = {
            ...state,
            creator: props.user
        }
        dispatch(add(token,page));
        // Redirect to the new page
        dispatch(getPage(token,pagestate.id));
        navigate("/api/lorepage/"+pagestate.id);
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
                <label htmlFor="categories" className="form-label">Categories</label>
                <select name="categories"
                        id="categories"
                        className="form-select"
                        // multiple
                        aria-label="Select Categories"
                        onChange={onChange}>
                    {categories}
                </select>

						{/* value={state.categories}/> */}
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
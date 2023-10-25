import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {add} from '../actions/pageActions';
import Relationships from './Relationships';
import { useNavigate } from 'react-router-dom';

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
    const [catState,setCatState] = useState(["Uncategorised"])

    const[rowIncrement,setRowIncrement] = useState(0)

    // const appState = useSelector((state) => {
    //     return {
	// 		stopLoading:state.login.stopLoading
	// 	}
    //     })


    const token = useSelector(state => state.login.token);
    const dispatch = useDispatch();

    const defaultCategories = ["Uncategorised","Characters","NPCs","Locations","Dates"]

    let categories = []
    defaultCategories.map(category => {
        categories.push(<option  key={category} value={category.toLocaleLowerCase()}>{category}</option>)
    });


    const lorepages = [{name: "Jane", id:2},{name: "Mark", id:3},{name: "Paul", id:4}]

    const rel_dropdown =[]

    lorepages.map((lore) => {
       rel_dropdown.push(<option key={lore.name} value={lore.id}>{lore.name}</option>)
    });
        
    const onChange = (event) => {
        setState((state) => {
            return {
                ...state,
                [event.target.name]:event.target.value
            }
        })
    }

    const onCatChange = (event) => {
        setState((catState) => {
            return [
                ...catState,
                event.target.value
            ]        
        })
    }

    const onRelChange = (event) => {
        setState((state) => {
            return {
                ...relState,
                [event.target.name]:event.target.value
            }
        })
    }
    

    const CategoryRow = (props) => {
        return(
        <>
        <label htmlFor="categories" className="form-label">Categories</label>
                <select name="categories"
                        id="categories"
                        className="form-select"
                        // multiple
                        aria-label="Select Categories"
                        onChange={onCatChange}>
                    {categories}
                </select>
                <button htmlFor="categories" type='button' onClick={() => handleThisClick()}
				className="btn btn-primary"
				>Add categories</button>
        </>
    )}
    
    let categoryrows= [ <CategoryRow key="Default"/>]


    const handleThisClick = (event) =>{
        categoryrows.push(
        <CategoryRow key={rowIncrement}/>            
        )
        setState(rowIncrement+1)
    }
    //navigate(state.page.page.id) 
    //onsubmit ajaa vaan 1 kerran?

    const onSubmit = (event) => {
        event.preventDefault();
        let page = {
            ...state,
            creator: props.user
        }
        dispatch(add(token,page));
        //täs kohtaa haluan et vaastedes redirect sille LorePagelle ku painat submit

        // const navigate = useNavigate();
        // if(appState.stopLoading) {
        //     navigate("/api/lorepage/"+appState.page.page.id)
        // }
        setState({
            title:"",
            categories:[],
            image:"",
            summary:"",
            description:"",
            relationships:[],
            notes:""
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
                {categoryrows}

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
                <label htmlFor="relationships" className="form-label">Relationships</label>

                        <table>
                        <tbody>
                        <tr>
                            <td><input type="text"
                                        id="reltype"
                                        name="reltype"
                                        className="form-control"
                                        onChange={onRelChange}
                                        value={state.reltype}/></td>
                            <td>
                            <select name="target"
                                        id="target"
                                        className="form-select"
                                        aria-label="relationship target"
                                        onChange={onRelChange}>
                                        <option value="">Select relationship link</option>
                                    {rel_dropdown}
                                </select>
                            </td>
                        </tr>
                        </tbody>
                        </table>

				    {/* <Relationships relationships={state.relationships}/> */}
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
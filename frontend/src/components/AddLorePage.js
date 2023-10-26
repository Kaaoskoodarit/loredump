import {useEffect, useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {add} from '../actions/pageActions';
import Relationships from './Relationships';
import { useNavigate } from 'react-router-dom';
import {CategoryRows, CatRow} from './CategoryRows'

const AddLorePage = (props) => {
	
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

    const [relState,setRelState] = useState({
        reltype:"",
        target:""
    })

    const[categoryState,setCategoryState] = useState({default:"Uncategorised"})

    // const[categoryRows,setCategoryRows] = useState([])

    // const appState = useSelector((state) => {
    //     return {
	// 		stopLoading:state.login.stopLoading
	// 	}
    //     })
    
    const token = useSelector(state => state.login.token);
    const dispatch = useDispatch();

            //TO BE REPLACED WITH HOOKS TO ACTUAL LISTS
    
    const lorepages = [{name: "Jane", id:2},{name: "Mark", id:3},{name: "Paul", id:4}]

    const rel_dropdown =[]

    //Map each Page of Lore to an accessible list in Rel-dropdown
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

    const onRelChange = (event) => {
        setState(() => {
            return {
                ...relState,
                [event.target.name]:event.target.value
            }
        })
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
                <CategoryRows state={state} setState={setState} categoryState={categoryState} onChange={onCatChange}/>
                {/* {categoryrows} */}

						{/* value={state.categories}/> */}
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
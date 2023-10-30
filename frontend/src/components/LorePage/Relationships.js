import {useSelector} from 'react-redux';

const Relationships = (props) => {

    //PROPS passed information
    const onChange = props.onChange
    const state = props.state
    const setState = props.setState

    const pagelist = useSelector(state => state.category.list);

    /*
    // poistettavaa testi koodia
    const lorepages = [{name: "Jane", id:2},{name: "Mark", id:3},{name: "Paul", id:4}]

    const rel_dropdown =[]

    lorepages.map((lore) => {
       rel_dropdown.push(<option key={lore.name} value={lore.id}>{lore.name}</option>)
    });
    */
    let relDropdown = pagelist.map(page => {
        return <option key={page.id} value={page.id}>{page.title}</option>
    })

    const addRelRow = () => {
        setState((state)=>{
            //add one "" entry to the end of state Categories 
            let tempRel = state.relationships.concat({
                reltype:"",
                target:""
            })
            return{
                ...state,
                relationships:tempRel
            }
        })
    }

    const removeRelRow = (index) => {
        setState((state)=>{
            //take out one entry from that index location
            let tempCats = state.relationships.toSpliced(index,1)
            return{
                ...state,
                relationships:tempCats
            }
        })
    }


    const handleClick = (event,index) =>{
        if (event==="ADD"){
            //console.log("ADDING");
            addRelRow();     
        }
        else if (event==="REMOVE"){
            //console.log("REMOVING index:", index)
            removeRelRow(index);
        }  
    }

    //THE COMPONENT THAT GENERATES EACH ROW OF CATEGORIES
    const RelRow = (props) => {

        let index = props.index

        // Gets the Title of a category based on its ID
        const getRelTitle = (selected) => {
            for(let i = 0;i<pagelist.length;i++) {
                if(pagelist[i].id === selected) {
                    return pagelist[i].title;
                }
            }
            return selected;
        }
        let relTitle = getRelTitle(state.relationships[index].target)

        //ADDING DEFAULT TEXT TO CATEGORY ROWS IF NEWLY ADDED ("")
        let selectedText = state.relationships[index].target !== "" ? relTitle : "Select a Category"

        
        //ONLY ADD REMOVE BUTTONS TO ROWS AFTER THE INITAL ONE
        let removeButton;
        if (index > 0){
            removeButton =(   
                <td>
                <button htmlFor="categories" type='button' onClick={() => handleClick("REMOVE",index)}
                    className="btn btn-primary">Remove</button>
                </td>
            )
        } 

        return(
            <tr key={index}>
                <td>
                    <input type="text"
						id="reltype"
						name="reltype"
						className="form-control"
						onChange={props.onChange}
						value={props.relationships[index].reltype}/>
                </td>
                <td>
			        <select name="target"
                        id={index}
                        className="form-select"
                        aria-label="Select Relationship Link"
                        onChange={props.onChange}>
                    <option key={"selected"} value={state.relationships[index].target}>{selectedText}</option>
                    {relDropdown}
                    </select>
                </td>
                {removeButton}
            </tr>
        )
    }

    //rows , a list of all CatRows, if none get added reads ERR
    let rows = [<>LOADING ERR</>]
    //for each entry in state.categories, generate one row of CatRow
    rows = state.relationships.map((relationship,index)=>{
        return <RelRow key={index+":"+relationship.target} value={relationship} index={index} onChange={onChange}/>
    })


    //RENDERING

    return(
        <>
            <label htmlFor="relationships" className="form-label">Add to Relationships:</label>
            <table name="relationships">
                <tbody>
                    {rows}
                </tbody>
            </table>
            <button htmlFor="relationships" type='button' onClick={() => handleClick("ADD",rows)}
            className="btn btn-primary">+</button>
        </>
    )
}

export default Relationships;
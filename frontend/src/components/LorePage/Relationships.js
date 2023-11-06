import {useSelector} from 'react-redux';

//THE COMPONENT THAT GENERATES EACH ROW OF CATEGORIES
const RelRow = (props) => {

    let state = props.state
    let index = props.index

    const pagelist = useSelector(state => state.lore.list);

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
    //console.log(relTitle);

    //ADDING DEFAULT TEXT TO RELATIONSHIP ROWS IF NEWLY ADDED ("")
    let selectedText = state.relationships[index].target !== "" ? relTitle : "Select a Category"

    
    //ONLY ADD REMOVE BUTTONS TO ROWS AFTER THE INITAL ONE
    let removeButton;
    if (index > 0){
        removeButton =(   
            <td>
            <button htmlFor="relationships" type='button' onClick={() => props.handleClick("REMOVE",index)}
                className="btn btn-primary">Remove</button>
            </td>
        )
    } 

    return(
        <tr key={index}>
            <td>
                <input type="text"
                    id={index}
                    name="reltype"
                    className="form-control"
                    onChange={props.onChange}
                    value={state.relationships[index].reltype}/>
            </td>
            <td>
                <select name="target"
                    id={index}
                    className="form-select"
                    aria-label="Select Relationship Link"
                    onChange={props.onChange}>
                <option key={"selected"} value={state.relationships[index].target}>{selectedText}</option>
                {props.relDropdown}
                </select>
            </td>
            {removeButton}
        </tr>
    )
}

const Relationships = (props) => {

    //PROPS passed information
    //const onChange = props.onChange
    const state = props.state
    const setState = props.setState

    const pagelist = useSelector(state => state.lore.list);

    //OnChange function specifically for Relationships
    const onChange = (event) => {
        let tempRel=state.relationships
        tempRel[event.target.id] = {
            ...state.relationships[event.target.id],
            [event.target.name]:event.target.value
        } 
        setState(() => {
            return {
                ...state,
                relationships:tempRel
            }
        })
    }
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
            //add one "" entry to the end of state relationships 
            let tempRel = state.relationships.concat({
                reltype:"",
                target:""
            })
            console.log(tempRel);
            return {
                ...state,
                relationships:tempRel
            }
        })
    }

    const removeRelRow = (index) => {
        setState((state)=>{
            //take out one entry from that index location
            let tempRel = state.relationships.toSpliced(index,1)
            return {
                ...state,
                relationships:tempRel
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

    //rows , a list of all RelRows, if none get added reads ERR
    let rows = [<>LOADING ERR</>]
    //for each entry in state.relationships, generate one row of RelRow
    rows = state.relationships.map((relationship,index)=>{
        //console.log(relationship.reltype,relationship.target,index);
        return <RelRow key={index+":"+relationship.target} state={state} index={index} 
            relDropdown={relDropdown} onChange={onChange} handleClick={handleClick}/>
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
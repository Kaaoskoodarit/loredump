import {useSelector} from 'react-redux';

//THE COMPONENT THAT GENERATES EACH ROW OF CATEGORIES
const ConRow = (props) => {

    let state = props.state
    let index = props.index

    const pagelist = useSelector(state => state.lore.list);

    // Gets the Title of a category based on its ID
    const getConTitle = (selected) => {
        for(let i = 0;i<pagelist.length;i++) {
            if(pagelist[i].id === selected) {
                return pagelist[i].title;
            }
        }
        return selected;
    }
    let conTitle = getConTitle(state.connections[index].target_id)
    //console.log(relTitle);

    //ADDING DEFAULT TEXT TO RELATIONSHIP ROWS IF NEWLY ADDED ("")
    let selectedText = state.connections[index].target_id !== "" ? conTitle : "Select a Category"

    
    //ONLY ADD REMOVE BUTTONS TO ROWS AFTER THE INITAL ONE
    let removeButton;
    if (index > 0){
        removeButton =(   
            <td>
            <button htmlFor="connections" type='button' onClick={() => props.handleClick("REMOVE",index)}
                className="btn btn-primary">Remove</button>
            </td>
        )
    } 

    return(
        <tr key={index}>
            <td>
                <input type="text"
                    id={index}
                    name="type"
                    className="form-control"
                    onChange={props.onChange}
                    value={state.connections[index].type}/>
            </td>
            <td>
                <select name="target_id"
                    id={index}
                    className="form-select"
                    aria-label="Select Connection Link"
                    onChange={props.onChange}>
                <option key={"selected"} value={state.connections[index].target_id}>{selectedText}</option>
                {props.conDropdown}
                </select>
            </td>
            {removeButton}
        </tr>
    )
}

const Connections = (props) => {

    //PROPS passed information
    //const onChange = props.onChange
    const state = props.state
    const setState = props.setState

    const pagelist = useSelector(state => state.lore.list);

    //OnChange function specifically for Relationships
    const onChange = (event) => {
        let tempCon=state.connections
        tempCon[event.target.id] = {
            ...state.connections[event.target.id],
            [event.target.name]:event.target.value
        } 
        setState(() => {
            return {
                ...state,
                connections:tempCon
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
    let conDropdown = pagelist.map(page => {
        return <option key={page.id} value={page.id}>{page.title}</option>
    })

    const addConRow = () => {
        setState((state)=>{
            //add one "" entry to the end of state relationships 
            let tempCon = state.connections.concat({
                type:"",
                target_id:""
            })
            console.log(tempCon);
            return {
                ...state,
                connections:tempCon
            }
        })
    }

    const removeConRow = (index) => {
        setState((state)=>{
            //take out one entry from that index location
            let tempCon = state.connections.toSpliced(index,1)
            return {
                ...state,
                connections:tempCon
            }
        })
    }

    const handleClick = (event,index) =>{
        if (event==="ADD"){
            //console.log("ADDING");
            addConRow();     
        }
        else if (event==="REMOVE"){
            //console.log("REMOVING index:", index)
            removeConRow(index);
        }  
    }

    //rows , a list of all RelRows, if none get added reads ERR
    let rows = [<>LOADING ERR</>]
    //for each entry in state.relationships, generate one row of RelRow
    rows = state.connections.map((connection,index)=>{
        //console.log(relationship.reltype,relationship.target,index);
        return <ConRow key={index+":"+connection.target_id} state={state} index={index} 
            conDropdown={conDropdown} onChange={onChange} handleClick={handleClick}/>
    })


    //RENDERING

    return(
        <>
            <label htmlFor="connections" className="form-label">Add to Connections:</label>
            <table name="connections">
                <tbody>
                    {rows}
                </tbody>
            </table>
            <button htmlFor="connections" type='button' onClick={() => handleClick("ADD",rows)}
            className="btn btn-primary">+</button>
        </>
    )
}

export default Connections;
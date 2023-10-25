import {useState} from 'react';


const Relationships = (props) => {

    // poistettavaa testi koodia
    const lorepages = [{name: "Jane", id:2},{name: "Mark", id:3},{name: "Paul", id:4}]

    const rel_dropdown =[]

    lorepages.map((lore) => {
       rel_dropdown.push(<option key={lore.name} value={lore.id}>{lore.name}</option>)
    });

    // poistettavaa koodia loppuu


    const [state,setState] = useState({
        relationships:props.relationships,
        reltype:"",
        target: ""
    })
    
    const onChange = (event) => {
        setState((state) => {
            return {
                ...state,
                relationships :[{
                    [event.target.name]:event.target.value
                }]
            }
        });
        // setState((state)=>{
        //     return{
        //     ...state,
        //     relationship_list: [...props.relationships, {}]
        // }
        // })
    }

    // const onDropdownChange = (event) => {
    //     setState((state) => {
    //         return {
    //             ...state,
    //             relationships:[{target: event.target.value}]
    //         }
    //     })
    // }

    
	
	return(
        <table>
      <tbody>
		<tr>
			<td><input type="text"
						id="reltype"
						name="reltype"
						className="form-control"
						onChange={onChange}
						value={state.reltype}/></td>
            <td>
			<select name="target"
                        id="target"
                        className="form-select"
                        aria-label="relationship target"
                        onChange={onChange}>
                        <option value="">Select relationship link</option>
                    {rel_dropdown}
                </select>
            </td>
		</tr>
        </tbody>
        </table>
	)
}

export default Relationships;
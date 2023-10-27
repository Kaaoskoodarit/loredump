const Relationships = (props) => {

    // poistettavaa testi koodia
    const lorepages = [{name: "Jane", id:2},{name: "Mark", id:3},{name: "Paul", id:4}]

    const rel_dropdown =[]

    lorepages.map((lore) => {
       rel_dropdown.push(<option key={lore.name} value={lore.id}>{lore.name}</option>)
    });

    // poistettavaa koodia loppuu

	return(
        <div>
            <label htmlFor="relationships" className="form-label">Relationships</label>
            <table>
                <tbody>
		            <tr>
			            <td><input type="text"
						    id="reltype"
						    name="reltype"
						    className="form-control"
						    onChange={props.onChange}
						    value={props.relationships.reltype}/></td>
                        <td>
			                <select name="target"
                                id="target"
                                className="form-select"
                                aria-label="relationship target"
                                onChange={props.onChange}>
                            <option value="">Select relationship link</option>
                            {rel_dropdown}
                            </select>
                        </td>
		            </tr>
                </tbody>
            </table>
        </div>
	)
}

export default Relationships;
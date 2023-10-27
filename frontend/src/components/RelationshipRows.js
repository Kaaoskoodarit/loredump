export const CategoryRows = (props) => {

    //PROPS passed information
    const onCatChange = props.onChange
    const state = props.state
    const setState = props.setState

    //CODE TO BE REPLACED LATER - - This is for testing
    const defaultCategories = ["Characters","NPCs","Locations","Dates"]

    let categoriesDropdown = []
    defaultCategories.map(category => {
        categoriesDropdown.push(<option key={category} value={category}>{category}</option>)
    });
    

    const addCatRow = () => {
        setState((state)=>{
            //add one "" entry to the end of state Categories 
            let tempCats = state.categories.concat("")
            return{
                ...state,
                categories:tempCats
            }
        })
    }

    const removeCatRow = (index) => {
        setState((state)=>{
            //take out one entry from that index location
            let tempCats = state.categories.toSpliced(index,1)
            return{
                ...state,
                categories:tempCats
            }
        })
    }


    //Handle Clicking for buttons in Category Select
    const handleClick = (event,index) =>{
        if (event==="ADD"){
            //console.log("ADDING");
            addCatRow();     
        }
        else if (event==="REMOVE"){
            //console.log("REMOVING index:", index)
            removeCatRow(index);
        }  
    }

    //THE COMPONENT THAT GENERATES EACH ROW OF CATEGORIES
    const CatRow = (props) => {

        let index = props.index

        //ADDING DEFAULT TEXT TO CATEGORY ROWS IF NEWLY ADDED ("")
        let selectedText = state.categories[index] !== "" ? state.categories[index] : "Select a Category"
    
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
                    <select name={"categories"}
                            id={index}
                            className="form-select"
                            aria-label="Select Categories"
                            onChange={onCatChange}>
                        <option key={"selected"} value={state.categories[index]}>{selectedText}</option>
                        {categoriesDropdown}
                    </select>
                </td>
                {removeButton}
            </tr>
        )
    }

    //rows , a list of all CatRows, if none get added reads ERR
    let rows = [<>LOADING ERR</>]
    //for each entry in state.categories, generate one row of CatRow
    rows = state.categories.map((category,index)=>{
        return <CatRow key={index+":"+category} value={category} index={index}/>
    })


    //RENDERING

    return(
        <>
            <label htmlFor="categories" className="form-label">Add to Categories:</label>
            <table name="categories">
                <tbody>
                    {rows}
                </tbody>
            </table>
            <button htmlFor="categories" type='button' onClick={() => handleClick("ADD",rows)}
            className="btn btn-primary">+</button>
        </>
    )
}
        

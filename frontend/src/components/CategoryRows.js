import {useEffect, useState} from 'react';



export const CategoryRows = (props) => {

        //CODE TO BE REPLACED LATER - - This is for testing
        const defaultCategories = ["Characters","NPCs","Locations","Dates"]

        let categoriesDropdown = []
        defaultCategories.map(category => {
        categoriesDropdown.push(<option  key={category} value={category}>{category}</option>)
        });
    
    const[rowIncrement,setRowIncrement] = useState(0)

    const addCatRow = () => {
        setState((state)=>{
            let tempCats = state.categories.concat("")
            return{
                ...state,
                categories:tempCats
            }
        })
        rows.push(
            <CatRow setState={setState} index={rowIncrement}/>
                )
        console.log(rows.length,rows)
    }

    const handleClick = (event) =>{

        if (event==="ADD"){
            console.log("ADDING");
            addCatRow();
        // const tempRows= categoryRows.concat(
            
            // setCategoryState{
            //     ...categoryState,
            //     [rowIncrement]:""
            // };
        setRowIncrement(rowIncrement+1)
        
        }
        else if (event==="Remove"){
            console.log("REMOVING")

        }
        
    }
        //PROPS information
        const onCatChange = props.onChange
        const categoryState = props.categoryState
        let rows = [<>TYHKJÄ</>]
        const state = props.state
        const setState = props.setState

    

    const CatRow = (props) => {
        let value= props.value

        //iterate state.categories and tell that the nth one is Uncategorised
        // let temp =[ 
        // ...state.categories,
        // state.categories[props.index]="Uncategorised"]

        // props.setState({
        //     ...state,
        //     [state.categories]:temp
        //     })
        let index = props.index

        //ADDING DEFAULT TEXT TO CATEGORY ROWS
        let selectedText = state.categories[index] !== "" ? state.categories[index] : "Select a Category"
    
        let removeButton;
        if (index > 0){
         removeButton =(   
            <td>
            <button htmlFor="categories" type='button' onClick={() => handleClick("REMOVE")}
            className="btn btn-primary"
            >Remove Row</button>
            </td>)
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
                </tr>) 
 
    }

    rows = state.categories.map((category,index)=>{
        return <CatRow value={category} index={index}/>
        })
    // rows = props.state.categories.map((index)=>{
    //     <CatRow index={index}/>
    // })


    //RENDERING

        return(
            <>
            <label htmlFor="categories" className="form-label">Categories</label>
                    <table name="categories">
                        {rows}
                    </table>
                    <button htmlFor="categories" type='button' onClick={() => handleClick("ADD",rows)}
                    className="btn btn-primary"
                    >Add categories</button>
            </>
        )
        }
        

   

                // let rows = <>Tyhjä</>
        // //This should make the number of rows dynamic
        // console.log("categories",state.categories)
        // // useEffect(()=>{

        //     rows = state.categories.map((category)=>{
        //         <tr>
        //         <td>
        //             <select name="categories"
        //                     id="categories"
        //                     className="form-select"
        //                     aria-label="Select Categories"
        //                     onChange={onCatChange}>
        //                 <option  key={"selected"} value={category.toLocaleLowerCase()} selected>{category}</option>
        //                 {categoriesDropdown}
        //             </select>
        //         </td>
        //         <td>
        //             <button htmlFor="categories" type='button' onClick={() => handleThisClick()}
        //             className="btn btn-primary"
        //             >Add categories</button>
        //         </td>
        //         </tr>
        //     })
        //     setCategoryRows(rows)
            
        // // },[state.categories])


        // console.log("rows;",rows)

           

    // const CategoryRow = (props) => {
    //     return(
    //     <>
    //     <label htmlFor="categories" className="form-label">Categories</label>
    //             <select name="categories"
    //                     id="categories"
    //                     className="form-select"
    //                     // multiple
    //                     aria-label="Select Categories"
    //                     onChange={onCatChange}>
    //                 {categories}
    //             </select>
    //             <button htmlFor="categories" type='button' onClick={() => handleThisClick()}
	// 			className="btn btn-primary"
	// 			>Add categories</button>
    //     </>
    // )}


        //let categoryrows= [ <CategoryRow key="Default"/>]
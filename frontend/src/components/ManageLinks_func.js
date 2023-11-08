import {useSelector,useDispatch} from 'react-redux';
import { updateCategory, getCategoryList } from '../actions/categoryActions';


    // console.log("ManageLinks says Hi!",mode)
    // const token = useSelector(state => state.login.token);
    // const links = useSelector(state => state.category.page.links);
    

	// const dispatch = useDispatch();
    // dispatch(getCategoryList(token,"verbose"))

    //FUNCTION SELECTED BASED ON MODE IN SWITCH CASE BELOW

    // const editCategories = (editfunction) => {
    //     // iterate through categories in the list
    //     for (let thiscategory of categorylist)
    //         if (page.categories.includes(thiscategory.id)) {
    //             editfunction(thiscategory);
    //         }
    // }

    export const addLinkToCategory = (token, page) => { 
        console.log("Adding page: ",page)
        return async (dispatch) =>{
            console.log("ManageLinks: ADDING LINK!")
            const categorylist = await dispatch(getCategoryList(token,"verbose"))
            //const categorylist = store.category.list
        
            for (let thiscategory of categorylist) {
                if (page.categories.includes(thiscategory.id)) {
                    console.log(thiscategory.title,thiscategory.links)
                    // iterate through categories in the list found in Store
                    const tempData ={
                        links: thiscategory.links.concat(page.id)}

                    console.log("Dispatching edit on category",token,thiscategory.id,tempData)
                    dispatch(updateCategory(token,thiscategory.id,tempData));
                    }
            }
                
        }
    }
      

    export const removeLinkFromCategory = (page,store) => {
        return (dispatch) =>{
            const token = store.login.token
            console.log("ManageLinks: REMOVING LINK!");
            dispatch(getCategoryList(token,"verbose"))
            const categorylist = store.category.list
            const links = store.category.page.links;
                
          for (let thiscategory of categorylist){
                if (page.categories.includes(thiscategory.id)) {
       
                //filter returns a new array based on function returning 'true's
                const filteredLinks = thiscategory.links.filter((id)=>id !==page.id);

                //let through only links that aren't the one that's removed now
                const tempData = {links: filteredLinks}
                
                console.log("Dispatching edit on category",tempData);
                dispatch(updateCategory(token,thiscategory.id,tempData));
            }
            }
        }
    }

        

        // for (let thiscategory of categorylist)
        //     if (category.id === thiscategory.id) {
        //         const tempLinks ={
        //             links: category.links.concat(page.id)}
        //     console.log("Dispatching edit on category",tempLinks)
        //     //dispatch(updateCategory(token,category.id,tempLinks));
        //     }

        // // iterate through categories in the list found in Store
        // for (let thiscategory of categorylist)
        //     if (category.id === thiscategory.id) {
        //         const tempLinks ={
        //             links: [...category.links]}
        //     console.log("Dispatching edit on category",tempLinks)
        //     //dispatch(updateCategory(token,category.id,tempLinks));
        //     }



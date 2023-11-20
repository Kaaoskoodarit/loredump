import {useSelector,useDispatch} from 'react-redux';
import { updateCategory, getCategoryList } from '../actions/categoryActions';

//!THIS COMPONENT IS NOT IN USE

//functionality moved to backend

export const ManageLinks = ({mode, page, categoryPage}) => {
    console.log("ManageLinks says Hi!",mode)
    const token = useSelector(state => state.login.token);
    const links = useSelector(state => state.category.page.links);
    const categorylist = useSelector(state => state.category.list);

	const dispatch = useDispatch();
    dispatch(getCategoryList(token,"verbose"))

    //FUNCTION SELECTED BASED ON MODE IN SWITCH CASE BELOW

    const editCategories = (editfunction) => {
        // iterate through categories in the list
        for (let thiscategory of categorylist)
            if (page.categories.includes(thiscategory.id)) {
                editfunction(thiscategory);
            }
    }

    const addLinkToCategory = (category) => {    
        console.log("ManageLinks: ADDING LINK!")
            
        // iterate through categories in the list found in Store
        if (categorylist.includes(category)){
            const tempData ={
                links: category.links.concat(page.id)}
        console.log("Dispatching edit on category",tempData)
        dispatch(updateCategory(token,category.id,tempData));
        } else {
            console.log("ManageLinks: Category not in state.category.list : ",category)
        }
    }

    const removeLinkFromCategory = (page,category) => {
        console.log("ManageLinks: REMOVING LINK!");
        
        if (categorylist.includes(category)){

            //filter returns a new array based on function returning 'true's
            const filteredLinks = category.links.filter((id)=>id !==page.id);

            //let through only links that aren't the one that's removed now
            const tempData = {links: filteredLinks}
            
            console.log("Dispatching edit on category",tempData);
            dispatch(updateCategory(token,category.id,tempData));
        } else {
            console.log("ManageLinks: Category not in state.category.list : ",category)
        }
    }

    switch (mode) {
        case "add-page":
            editCategories(addLinkToCategory);
            return <>{mode}</>
        case "remove-page":
            editCategories(removeLinkFromCategory);
            return <>{mode}</>
        case "":
            return <>{mode}</>
        default:
            console.log ("Managelinks mode not found: ",mode);
            return <>{mode}</>
    }
    return <>{mode}</>

        
}
export default ManageLinks;

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



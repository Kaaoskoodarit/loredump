import {useSelector,useDispatch} from 'react-redux';
import { updateCategory } from '../actions/categoryActions';

const token = useSelector(state => state.login.token);
const categorylist = useSelector(state => state.category.list);
const dispatch = useDispatch();


export const addLink = (props) => {
    console.log("ManageLinks: ADDING LINK!")
        
        // iterate through categories in the list found in Store
        if (categorylist.includes(props.category)){
            const tempLinks ={
                links: props.category.links.concat(page.id)}
        console.log("Dispatching edit on category",tempLinks)
        //dispatch(updateCategory(token,props.category.id,tempLinks));
        } else {
            console.log("ManageLinks: Category not in state.category.list : ",props.category)
        }

        // for (let thiscategory of categorylist)
        //     if (props.category.id === thiscategory.id) {
        //         const tempLinks ={
        //             links: props.category.links.concat(page.id)}
        //     console.log("Dispatching edit on category",tempLinks)
        //     //dispatch(updateCategory(token,props.category.id,tempLinks));
        //     }

        
    }


export const removeLink = (page,category) => {
        console.log("ManageLinks: REMOVING LINK!")

        if (categorylist.includes(category)){
            

            //let through only links that aren't the one that's removed now
            const tempLinks ={
                //filter returns a new array based on function returning 'true's
                links: category.links.filter((id)=>{id !==page.id})
            }
        console.log("Dispatching edit on category",tempLinks)
        //dispatch(updateCategory(token,category.id,tempLinks));
        } else {
            console.log("ManageLinks: Category not in state.category.list : ",category)
        }

        // // iterate through categories in the list found in Store
        // for (let thiscategory of categorylist)
        //     if (category.id === thiscategory.id) {
        //         const tempLinks ={
        //             links: [...category.links]}
        //     console.log("Dispatching edit on category",tempLinks)
        //     //dispatch(updateCategory(token,category.id,tempLinks));
        //     }

    }

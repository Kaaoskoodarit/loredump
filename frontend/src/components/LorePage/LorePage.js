import {useState} from 'react';
import Row from '../Category/Row';
import RemoveRow from '../../components-old/RemoveRow';
import EditRow from '../../components-old/EditRow';
import {useSelector,useDispatch} from 'react-redux';
import {remove,edit} from '../../actions/pageActions';
import { Link } from 'react-router-dom';

//page: list, page, error


const LorePage = (props) => {
	// Get token and list from "store" state with useSelector
	const appState = useSelector((state) => {
		return {
			token:state.login.token,
            page:state.page.page
		}
	})
    const page = appState.page


    // Use dispatcer from react-redux
	const dispatch = useDispatch();

    const getPage = (id) => {
        dispatch(getPage(appState.token,id));
    }

    const removePage = (id) => {
		dispatch(remove(appState.token,id));
	}

    const editPage = (page) => {
		dispatch(edit(appState.token,page));
	}
    // const pages = appState.page.map((page,index) => {
	// 	// if(index === state.removeIndex) {
	// 	// 	return(
	// 	// 		<RemoveRow key={page.id} page={page} changeMode={changeMode} removePage={removePage}/>
	// 	// 	)
	// 	// }
	// 	// if(index === state.editIndex) {
	// 	// 	return(
	// 	// 		<EditRow key={page.id} page={page} changeMode={changeMode} editPage={editPage}/>
	// 	// 	)
	// 	// }
	// 	return(
	// 		<Row key={page.id} page={page} index={index}/>
	// 	)
	// })
    // const categoryList = page.categories.map((category) => <h3>{category}</h3>)

	return(
        <div>
            {/* {categoryList} */}
            {/* <Link to category */}
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Creator, id (TEST DATA)</th>
					<th>Title</th>
					<th>Image</th>
					<th>Summary</th>
					<th>Description</th>
					<th>Relationships</th>
					<th>Notes</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
            <tr>
                <td>{page.creator} {page.id}</td>
                <td>{page.title}</td>
                <td>{page.image}</td>
                <td>{page.summary}</td>
                <td>{page.description}</td>
                {/* <td>{page.relationships}</td> */}
                <td>TBD</td>
                <td>{page.notes}</td>
            </tr>
			</tbody>
		</table>
        </div>
	)
}
export default LorePage;
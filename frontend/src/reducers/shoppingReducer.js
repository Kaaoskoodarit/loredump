import * as actionConstants from '../actions/actionConstants';

const getInitialState = () => {
	if(sessionStorage.getItem("shoppingstate")) {
		let state = JSON.parse(sessionStorage.getItem("shoppingstate"));
		return state;
	} else {
		return {
			list:[],
			error:""
		}
	}
}

const saveToStorage = (state) => {
	sessionStorage.setItem("shoppingstate",JSON.stringify(state));
}

const initialState = getInitialState();

const shoppingReducer = (state = initialState,action) => {
	console.log("shoppingReducer,action",action);
	let tempState = {
		...state
	}
	switch(action.type) {
		case actionConstants.LOADING:
			return {
				...state,
				error:""
			}
		case actionConstants.FETCH_LIST_SUCCESS:
			tempState = {
				...state,
				list:action.list
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.ADD_ITEM_SUCCESS:
		case actionConstants.REMOVE_ITEM_SUCCESS:
		case actionConstants.EDIT_ITEM_SUCCESS:
			return state;
		case actionConstants.FETCH_LIST_FAILED:
		case actionConstants.ADD_ITEM_FAILED:
		case actionConstants.REMOVE_ITEM_FAILED:
		case actionConstants.EDIT_ITEM_FAILED:
			tempState = {
				...state,
				error:action.error
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_SUCCESS:
		case actionConstants.LOGOUT_FAILED:
			tempState = {
				list:[],
				error:""
			}
			saveToStorage(tempState);
			return tempState;
		default:
			return state;
	}
}

export default shoppingReducer;
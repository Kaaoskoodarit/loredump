import * as actionConstants from '../actions/actionConstants';

// Check if we have a state stored in sessionStorage
const getInitialState = () => {
	if(sessionStorage.getItem("categorystate")) {
		let state = JSON.parse(sessionStorage.getItem("categorystate"));
		return state;
	} else {
		return {
			list:[],
			page:{},
			error:""
		}
	}
}

// Save to sessionStorage
const saveToStorage = (state) => {
	sessionStorage.setItem("categorystate",JSON.stringify(state));
}

// Initialize state
const initialState = getInitialState();

// Reducer to handle shopping actions
const categoryReducer = (state = initialState,action) => {
	console.log("categoryReducer,action",action);
	let tempState = {
		...state
	}
	switch(action.type) {
		case actionConstants.LOADING:
			return {
				...state,
				error:""
			}
		case actionConstants.FETCH_CATEGORYLIST_SUCCESS:
			tempState = {
				...state,
				list:action.list
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.FETCH_CATEGORY_SUCCESS:
			tempState = {
				...state,
				page:action.page
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.REMOVE_CATEGORY_SUCCESS:
			tempState = {
				...state,
				page:{}
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.ADD_CATEGORY_SUCCESS:
		case actionConstants.EDIT_CATEGORY_SUCCESS:
			return state;
		case actionConstants.FETCH_CATEGORYLIST_FAILED:
		case actionConstants.FETCH_CATEGORY_FAILED:
		case actionConstants.ADD_CATEGORY_FAILED:
		case actionConstants.REMOVE_CATEGORY_FAILED:
		case actionConstants.EDIT_CATEGORY_FAILED:
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
                page:{},
				error:""
			}
			saveToStorage(tempState);
			return tempState;
		default:
			return state;
	}
}

export default categoryReducer;
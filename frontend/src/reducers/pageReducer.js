import * as actionConstants from '../actions/actionConstants';

// Check if we have a state stored in sessionStorage
const getInitialState = () => {
	if(sessionStorage.getItem("pagestate")) {
		let state = JSON.parse(sessionStorage.getItem("pagestate"));
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
	sessionStorage.setItem("pagestate",JSON.stringify(state));
}

// Initialize state
const initialState = getInitialState();

// Reducer to handle shopping actions
const pageReducer = (state = initialState,action) => {
	console.log("pageReducer,action",action);
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
		case actionConstants.FETCH_PAGE_SUCCESS:
			tempState = {
				...state,
				page:action.page
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.REMOVE_PAGE_SUCCESS:
			tempState = {
				...state,
				page:{}
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.ADD_PAGE_SUCCESS:
		case actionConstants.EDIT_PAGE_SUCCESS:
			return state;
		case actionConstants.FETCH_LIST_FAILED:
		case actionConstants.FETCH_PAGE_FAILED:
		case actionConstants.ADD_PAGE_FAILED:
		case actionConstants.REMOVE_PAGE_FAILED:
		case actionConstants.EDIT_PAGE_FAILED:
			tempState = {
				...state,
				error:action.error
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.NO_PAGES_FOUND:
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

export default pageReducer;
import {loading,stopLoading,logoutFailed} from './loginActions';
import * as actionConstants from './actionConstants';

//ASYNC THUNKS

// (async) function that dispatches a getList action to the reducer
// This displays the shopping list
export const getList = (token) => {
	return async (dispatch) => {
		// Set request
		let request = {
			"method":"GET",
			"headers":{
				"token":token
			}
		}
		// Start loading
		dispatch(loading());
		// Try to fetch the shopping list from the server, wait for response
		const response = await fetch("/api/shopping",request);
		// Stop loading
		dispatch(stopLoading());
		// If no response, error
		if(!response) {
			dispatch(fetchListFailed("Failed to fetch shopping information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// Try to parse response from JSON, wait for result
			const list = await response.json();
			// If no list, error
			if(!list) {
				dispatch(fetchListFailed("Failed to parse shopping information. Try again later."))
				return;
			}
			// If list found, show it!
			dispatch(fetchListSuccess(list));
		// If response not ok, error
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchListFailed("Failed to fetch shopping information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "add item" action to the reducer
export const add = (token,item) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"Content-type":"application/json",
				"token":token
			},
			"body":JSON.stringify(item)
		}
		dispatch(loading());
		const response = await fetch("/api/shopping",request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchItemFailed(actionConstants.ADD_ITEM_FAILED,"Failed to add new item. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch successful, show new list!
			dispatch(fetchItemSuccess(actionConstants.ADD_ITEM_SUCCESS));
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchItemFailed(actionConstants.ADD_ITEM_FAILED,"Failed to add new item. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "remove item" action to the reducer
export const remove = (token,id) => {
	return async (dispatch) => {
		let request = {
			"method":"DELETE",
			"headers":{
				"token":token
			}
		}
		dispatch(loading());
		const response = await fetch("/api/shopping/"+id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchItemFailed(actionConstants.REMOVE_ITEM_FAILED,"Failed to remove item. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list!
			dispatch(fetchItemSuccess(actionConstants.REMOVE_ITEM_SUCCESS));
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchItemFailed(actionConstants.REMOVE_ITEM_FAILED,"Failed to remove item. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "edit item" action to the reducer
export const edit = (token,item) => {
	return async (dispatch) => {
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json",
				"token":token
			},
			"body":JSON.stringify(item)
		}
		dispatch(loading());
		const response = await fetch("/api/shopping/"+item.id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchItemFailed(actionConstants.EDIT_ITEM_FAILED,"Failed to edit item. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchItemSuccess(actionConstants.EDIT_ITEM_SUCCESS));
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchItemFailed(actionConstants.EDIT_ITEM_FAILED,"Failed to edit item. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

//ACTION CREATORS

// Simple functions that return an "action" object, with
// a "type" parameter, and optionally others as well, as needed
const fetchListSuccess = (list) => {
	return {
		type:actionConstants.FETCH_LIST_SUCCESS,
		list:list
	}
}

const fetchListFailed = (error) => {
	return {
		type:actionConstants.FETCH_LIST_FAILED,
		error:error
	}
}

const fetchItemSuccess = (type) => {
	return {
		type:type
	}
}

const fetchItemFailed = (type,error) => {
	return {
		type:type,
		error:error
	}
}
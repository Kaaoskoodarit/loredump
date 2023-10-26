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
		const response = await fetch("/api/lorepage",request);
		// Stop loading
		dispatch(stopLoading());
		// If no response, error
		if(!response) {
			dispatch(fetchListFailed("Failed to fetch page information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// Try to parse response from JSON, wait for result
			const list = await response.json();
			// If no list, error
			if(!list) {
				dispatch(fetchListFailed("Failed to parse page information. Try again later."))
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
			dispatch(fetchListFailed("Failed to fetch page information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a getPage action to the reducer
// This displays the shopping list
export const getPage = (token,id) => {
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
		const response = await fetch("/api/lorepage/"+id,request);
		// Stop loading
		dispatch(stopLoading());
		// If no response, error
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.FETCH_PAGE_FAILED,"Failed to fetch page information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// Try to parse response from JSON, wait for result
			const page = await response.json();
			// If no list, error
			if(!page) {
				dispatch(fetchPageFailed(actionConstants.FETCH_PAGE_FAILED,"Failed to parse page information. Try again later."))
				return;
			}
			// If list found, show it!
			dispatch(fetchPageSuccess(actionConstants.FETCH_PAGE_SUCCESS,page));
		// If response not ok, error
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.FETCH_PAGE_FAILED,"Failed to fetch page information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "add item" action to the reducer
export const add = (token,page) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"Content-type":"application/json",
				"token":token
			},
			"body":JSON.stringify(page)
		}
		dispatch(loading());
		const response = await fetch("/api/lorepage",request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.ADD_PAGE_FAILED,"Failed to add new page. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch successful, show new list!
			dispatch(fetchPageSuccess(actionConstants.ADD_PAGE_SUCCESS));
			// Get updated list
			dispatch(getList(token));
			// Get new page
			const newpage = await response.json();
			dispatch(getPage(token,newpage.id))
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.ADD_PAGE_FAILED,"Failed to add new page. Server responded with a status "+response.status+" "+response.statusText))
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
		const response = await fetch("/api/lorepage/"+id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.REMOVE_PAGE_FAILED,"Failed to remove page. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list!
			dispatch(fetchPageSuccess(actionConstants.REMOVE_PAGE_SUCCESS));
			// Get updated list
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.REMOVE_PAGE_FAILED,"Failed to remove page. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "edit item" action to the reducer
export const edit = (token,page) => {
	return async (dispatch) => {
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json",
				"token":token
			},
			"body":JSON.stringify(page)
		}
		dispatch(loading());
		const response = await fetch("/api/lorepage/"+page.id,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.EDIT_PAGE_FAILED,"Failed to edit page. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchPageSuccess(actionConstants.EDIT_PAGE_SUCCESS));
			dispatch(getList(token));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.EDIT_PAGE_FAILED,"Failed to edit page. Server responded with a status "+response.status+" "+response.statusText))
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

const fetchPageSuccess = (type,page) => {
	return {
		type:type,
		page:page
	}
}

const fetchPageFailed = (type,error) => {
	return {
		type:type,
		error:error
	}
}
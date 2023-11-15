import {loading,stopLoading,logoutFailed} from './loginActions';
import { getWorld } from './worldActions';
import { getCategoryList } from './categoryActions';
import * as actionConstants from './actionConstants';

//ASYNC THUNKS

// (async) function that dispatches a getList action to the reducer
// This displays the list of pages
export const getList = (worldid) => {
	return async (dispatch) => {
		// Set request
		let request = {
			"method":"GET",
		}
		// Start loading
		dispatch(loading());
		// Try to fetch the page list from the server, wait for response
		const response = await fetch("/api/worlds/" + worldid + "/lore_pages", request);
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
			if(response.status === 401) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			} else if (response.status === 404) {
				dispatch(noPagesFound());
				console.log("Failed to fetch page information. No lorepages exist!");
				return;
			}
			dispatch(fetchListFailed("Failed to fetch page information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a getPage action to the reducer
export const getPage = (worldid, id) => {
	return async (dispatch) => {
		// Set request
		let request = {
			"method":"GET"
		}
		// Start loading
		dispatch(loading());
		// Try to fetch the page from the server, wait for response
		const response = await fetch("/api/worlds/" + worldid + "/lore_pages/" + id, request);
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
			// If no page, error
			if(!page) {
				dispatch(fetchPageFailed(actionConstants.FETCH_PAGE_FAILED,"Failed to parse page information. Try again later."))
				return;
			}
			// If page found, show it!
			dispatch(fetchPageSuccess(actionConstants.FETCH_PAGE_SUCCESS,page));
		// If response not ok, error
		} else {
			if(response.status === 401) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.FETCH_PAGE_FAILED,"Failed to fetch page information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "add page" action to the reducer
export const addPage = (worldid, page) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"Content-type":"application/json"
			},
			"body":JSON.stringify(page)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/" + worldid + "/lore_pages", request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.ADD_PAGE_FAILED,"Failed to add new page. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch successful, show new list!
			dispatch(fetchPageSuccess(actionConstants.ADD_PAGE_SUCCESS));
			// Get updated list
			dispatch(getList(worldid));
			// Get new pagefetchPageFailed
			const newpage = await response.json();
			dispatch(getPage(worldid,newpage.id))
			dispatch(getWorld(worldid));
			dispatch(getCategoryList(worldid));
		} else {
			if(response.status === 401) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.ADD_PAGE_FAILED,"Failed to add new page. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "remove page" action to the reducer
export const removePage = (worldid, id) => {
	return async (dispatch) => {
		let request = {
			"method":"DELETE"
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/" + worldid + "/lore_pages/" + id, request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.REMOVE_PAGE_FAILED,"Failed to remove page. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list!
			dispatch(fetchPageSuccess(actionConstants.REMOVE_PAGE_SUCCESS));
			// Get updated list
			dispatch(getList(worldid));
			dispatch(getWorld(worldid));
			dispatch(getCategoryList(worldid));
		} else {
			if(response.status === 401) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.REMOVE_PAGE_FAILED,"Failed to remove page. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "edit page" action to the reducer
export const editPage = (worldid, page) => {
	return async (dispatch) => {
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json"
			},
			"body":JSON.stringify(page)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/" + worldid + "/lore_pages/" + page.id, request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.EDIT_PAGE_FAILED,"Failed to edit page. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchPageSuccess(actionConstants.EDIT_PAGE_SUCCESS));
			dispatch(getList(worldid));
		} else {
			if(response.status === 401) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchPageFailed(actionConstants.EDIT_PAGE_FAILED,"Failed to edit page. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "update page" action to the reducer
export const updatePage = (worldid, id, update) => {
	return async (dispatch) => {
		let tempbody = {"update":update}
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json"
			},
			"body":	JSON.stringify(tempbody)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/" + worldid + "/lore_pages/update/" + id, request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchPageFailed(actionConstants.EDIT_PAGE_FAILED,"Failed to edit page. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchPageSuccess(actionConstants.EDIT_PAGE_SUCCESS));
			dispatch(getList(worldid));
		} else {
			if(response.status === 401) {
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

const noPagesFound = () => {
	return {
		type:actionConstants.NO_PAGES_FOUND
	}
}
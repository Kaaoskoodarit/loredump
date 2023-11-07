import {loading,stopLoading,logoutFailed} from './loginActions';
import * as actionConstants from './actionConstants';

//ASYNC THUNKS

// (async) function that dispatches a getCategoryList action to the reducer
// This displays the list of category pages
// if "mode" = names, only get list of names+ids
export const getCategoryList = (worldurl) => {
	return async (dispatch) => {
		let request = {}
		// Set request
        request = {
            "method":"GET"
         }
		// Start loading
		dispatch(loading());
		// Try to fetch the shopping list from the server, wait for response
		const response = await fetch("/api/worlds/"+worldurl+"/categories",request);
		// Stop loading
		dispatch(stopLoading());
		// If no response, error
		if(!response) {
			dispatch(fetchCategoryListFailed("Failed to fetch category information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// Try to parse response from JSON, wait for result
			const list = await response.json();
			// If no list, error
			if(!list) {
				dispatch(fetchCategoryListFailed("Failed to parse category information. Try again later."))
				return;
			}
			// If list found, show it!
			dispatch(fetchCategoryListSuccess(list));
		// If response not ok, error
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchCategoryListFailed("Failed to fetch category information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a getCategory action to the reducer
// This displays the category page
export const getCategory = (worldurl,url) => {
	return async (dispatch) => {
		// Set request
		let request = {
			"method":"GET"
		}
		// Start loading
		dispatch(loading());
		// Try to fetch the category from the server, wait for response
		const response = await fetch("/api/worlds/"+worldurl+"/categories/"+url,request);
		// Stop loading
		dispatch(stopLoading());
		// If no response, error
		if(!response) {
			dispatch(fetchCategoryFailed(actionConstants.FETCH_CATEGORY_FAILED,"Failed to fetch category information. Server never responded. Try again later"));
			return;
		}
		if(response.ok) {
			// Try to parse response from JSON, wait for result
			const category = await response.json();
			// If no list, error
			if(!category) {
				dispatch(fetchCategoryFailed(actionConstants.FETCH_CATEGORY_FAILED,"Failed to parse category information. Try again later."))
				return;
			}
			// If list found, show it!
			dispatch(fetchCategorySuccess(actionConstants.FETCH_CATEGORY_SUCCESS,category));
		// If response not ok, error
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchCategoryFailed(actionConstants.FETCH_CATEGORY_FAILED,"Failed to fetch category information. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "add category" action to the reducer
export const addCategory = (worldurl,category) => {
	return async (dispatch) => {
		let request = {
			"method":"POST",
			"headers":{
				"Content-type":"application/json"
			},
			"body":JSON.stringify(category)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/"+worldurl+"/categories",request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchCategoryFailed(actionConstants.ADD_CATEGORY_FAILED,"Failed to add new category. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch successful, show new list!
			dispatch(fetchCategorySuccess(actionConstants.ADD_CATEGORY_SUCCESS));
			// Get updated list
			dispatch(getCategoryList(worldurl));
			// Get new page
			const newcategory = await response.json();
			dispatch(getCategory(worldurl,newcategory.id))
			//dispatch(getCategory(worldurl,newcategory.custom_url)) // when transitioning from ids to urls
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchCategoryFailed(actionConstants.ADD_CATEGORY_FAILED,"Failed to add new category. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "remove category" action to the reducer
export const removeCategory = (worldurl,url) => {
	return async (dispatch) => {
		let request = {
			"method":"DELETE"
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/"+worldurl+"/categories/"+url,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchCategoryFailed(actionConstants.REMOVE_CATEGORY_FAILED,"Failed to remove category. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list!
			dispatch(fetchCategorySuccess(actionConstants.REMOVE_CATEGORY_SUCCESS));
			// Get updated list
			dispatch(getCategoryList(worldurl));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchCategoryFailed(actionConstants.REMOVE_CATEGORY_FAILED,"Failed to remove category. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "edit category" action to the reducer
export const editCategory = (worldurl,category) => {
	return async (dispatch) => {
		let request = {
			"method":"PUT",
			"headers":{
				"Content-type":"application/json"
			},
			"body":JSON.stringify(category)
		}
		dispatch(loading());
		const response = await fetch("/api/worlds/"+worldurl+"/categories/"+category.id,request);
		//const response = await fetch("/api/worlds/"+worldurl+"/categories/"+category.custom_url,request); // once we transition from IDs
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchCategoryFailed(actionConstants.EDIT_CATEGORY_FAILED,"Failed to edit category. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchCategorySuccess(actionConstants.EDIT_CATEGORY_SUCCESS));
			dispatch(getCategoryList(worldurl));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchCategoryFailed(actionConstants.EDIT_CATEGORY_FAILED,"Failed to edit category. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

// (async) function that dispatches a "update category" action to the reducer
export const updateCategory = (worldurl,url,update) => {
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
		const response = await fetch("/api/worlds/"+worldurl+"/categories/update/"+url,request);
		dispatch(stopLoading());
		if(!response) {
			dispatch(fetchCategoryFailed(actionConstants.EDIT_CATEGORY_FAILED,"Failed to edit category. Server never responded. Try again later"))
			return;
		}
		if(response.ok) {
			// If fetch succesful, show new list
			dispatch(fetchCategorySuccess(actionConstants.EDIT_CATEGORY_SUCCESS));
			dispatch(getCategoryList(worldurl));
		} else {
			if(response.status === 403) {
				dispatch(logoutFailed("Your session has expired. Logging you out."));
				return;
			}
			dispatch(fetchCategoryFailed(actionConstants.EDIT_CATEGORY_FAILED,"Failed to edit category. Server responded with a status "+response.status+" "+response.statusText))
		}
	}
}

//ACTION CREATORS

// Simple functions that return an "action" object, with
// a "type" parameter, and optionally others as well, as needed
export const fetchCategoryListSuccess = (list) => {
	return {
		type:actionConstants.FETCH_CATEGORYLIST_SUCCESS,
		list:list
	}
}

export const fetchCategoryListFailed = (error) => {
	return {
		type:actionConstants.FETCH_CATEGORYLIST_FAILED,
		error:error
	}
}

export const fetchCategorySuccess = (type,page) => {
	return {
		type:type,
		page:page
	}
}

export const fetchCategoryFailed = (type,error) => {
	return {
		type:type,
		error:error
	}
}
import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import { find, propEq, merge, not, append, equals } from 'ramda'

const action = (type, payload) => ({ type, payload })
const resources = createAsyncResourceBundle({
  name: 'categories',
  getPromise: ({ apiFetch }) => apiFetch('/categories')
})

const baseReducer = resources.reducer
// mixin reducers
resources.reducer = (state, action) => {
  // post resource
  if (action.type === 'CATEGORY_POST_STARTED') {
    state.isPosting = true
    state.postError = ''
    return state
  }
  if (action.type === 'CATEGORY_POST_FINISHED') {
    state.isPosting = false
    state.data = append(action.payload, state.data)
    return state
  }
  if (action.type === 'CATEGORY_POST_ERROR') {
    state.isPosting = false
    state.postError = action.payload
    return state
  }

  // update resource
  if (action.type === 'CATEGORY_PUT_STARTED') {
    state.isPutting = true
    state.putError = ''
    return state
  }
  if (action.type === 'CATEGORY_PUT_FINISHED') {
    state.isPutting = false
    state.data = map(
      resource =>
        equals(resource._id, action.payload._id) ? action.payload : resource,
      state.data
    )
    return state
  }
  if (action.type === 'CATEGORY_PUT_ERROR') {
    state.isPutting = false
    state.putError = action.payload
    return state
  }

  // remove resource
  if (action.type === 'CATEGORY_REMOVE_STARTED') {
    state.isRemoving = true
    state.removeError = ''
    return state
  }
  if (action.type === 'CATEGORY_REMOVE_FINISHED') {
    state.isRemoving = false
    state.data = reject(propEq('_id', action.payload._id), state.data)
    return state
  }
  if (action.type === 'CATEGORY_REMOVE_ERROR') {
    state.isRemoving = false
    state.removeError = action.payload
    return state
  }
  return baseReducer(state, action)
}

resources.reactCategoriesFetch = createSelector(
  'selectCategoriesShouldUpdate',
  shouldUpdate => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchCategories' }
    }
  }
)

resources.selectActiveCategory = createSelector(
  'selectPathname',
  'selectRouteParams',
  'selectCategories',
  (pathname, routeParams, categories) => {
    if (!pathname.includes('/categories') || !routeParams.id || !resources) {
      return null
    }

    return find(propEq('_id', routeParams.id), categories) || null
  }
)

resources.doPostCategory = category => ({ dispatch, apiFetch }) => {
  dispatch({ type: 'CATEGORY_POST_STARTED' })
  return apiFetch('/resources', {
    method: 'POST',
    body: JSON.stringify(category)
  })
    .then(result => {
      if (not(result.ok)) {
        return dispatch(action('CATEGORY_POST_ERROR', result))
      }
      return dispatch(
        action(
          'CATEGORY_POST_FINISHED',
          merge(category, { _id: result.id, _rev: result.rev })
        )
      )
    })
    .catch(err =>
      dispatch(action('CATEGORY_POST_ERROR', { message: err.message }))
    )
}

resources.doPutCategory = category => ({ dispatch, apiFetch }) => {
  dispatch({ type: 'CATEGORY_PUT_STARTED' })
  return apiFetch('/categories/' + category._id, {
    method: 'PUT',
    body: JSON.stringify(category)
  })
    .then(result => {
      if (not(result.ok)) {
        return dispatch(action('CATEGORY_PUT_ERROR', result))
      }
      return dispatch(
        action(
          'CATEGORY_PUT_FINISHED',
          merge(category, { _id: result.id, _rev: result.rev })
        )
      )
    })
    .catch(err =>
      dispatch(action('CATEGORY_PUT_ERROR', { message: err.message }))
    )
}

resources.doRemoveCategory = category => ({ dispatch, apiFetch }) => {
  dispatch({ type: 'CATEGORY_REMOVE_STARTED' })
  return apiFetch('/categories/' + category._id, {
    method: 'DELETE',
    body: JSON.stringify(resource)
  })
    .then(result => {
      if (not(result.ok)) {
        return dispatch(action('CATEGORY_REMOVE_ERROR', result))
      }
      return dispatch(
        action(
          'CATEGORY_REMOVE_FINISHED',
          merge(category, { _id: result.id, _rev: result.rev })
        )
      )
    })
    .catch(err =>
      dispatch(action('CATEGORY_REMOVE_ERROR', { message: err.message }))
    )
}
export default resources

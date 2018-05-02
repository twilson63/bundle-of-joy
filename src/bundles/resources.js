import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import { find, propEq, merge, not, append, equals } from 'ramda'

const action = (type, payload) => ({ type, payload })
const resources = createAsyncResourceBundle({
  name: 'resources',
  getPromise: ({ apiFetch }) => apiFetch('/resources')
})

const baseReducer = resources.reducer
// mixin reducers
resources.reducer = (state, action) => {
  // post resource
  if (action.type === 'RESOURCE_POST_STARTED') {
    state.isPosting = true
    state.postError = ''
    return state
  }
  if (action.type === 'RESOURCE_POST_FINISHED') {
    state.isPosting = false
    state.data = append(action.payload, state.data)
    return state
  }
  if (action.type === 'RESOURCE_POST_ERROR') {
    state.isPosting = false
    state.postError = action.payload
    return state
  }

  // update resource
  if (action.type === 'RESOURCE_PUT_STARTED') {
    state.isPutting = true
    state.putError = ''
    return state
  }
  if (action.type === 'RESOURCE_PUT_FINISHED') {
    state.isPutting = false
    state.data = map(
      resource =>
        equals(resource._id, action.payload._id) ? action.payload : resource,
      state.data
    )
    return state
  }
  if (action.type === 'RESOURCE_PUT_ERROR') {
    state.isPutting = false
    state.putError = action.payload
    return state
  }

  // remove resource
  if (action.type === 'RESOURCE_REMOVE_STARTED') {
    state.isRemoving = true
    state.removeError = ''
    return state
  }
  if (action.type === 'RESOURCE_REMOVE_FINISHED') {
    state.isRemoving = false
    state.data = reject(propEq('_id', action.payload._id), state.data)
    return state
  }
  if (action.type === 'RESOURCE_REMOVE_ERROR') {
    state.isRemoving = false
    state.removeError = action.payload
    return state
  }
  return baseReducer(state, action)
}

resources.reactResourcesFetch = createSelector(
  'selectResourcesShouldUpdate',
  shouldUpdate => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchResources' }
    }
  }
)

resources.selectActiveResource = createSelector(
  'selectPathname',
  'selectRouteParams',
  'selectResources',
  (pathname, routeParams, resources) => {
    if (!pathname.includes('/resources') || !routeParams.id || !resources) {
      return null
    }

    return find(propEq('_id', routeParams.id), resources) || null
  }
)

resources.doPostResource = resource => ({ dispatch, apiFetch }) => {
  dispatch({ type: 'RESOURCE_POST_STARTED' })
  return apiFetch('/resources', {
    method: 'POST',
    body: JSON.stringify(resource)
  })
    .then(result => {
      if (not(result.ok)) {
        return dispatch(action('RESOURCE_POST_ERROR', result))
      }
      return dispatch(
        action(
          'RESOURCE_POST_FINISHED',
          merge(resource, { _id: result.id, _rev: result.rev })
        )
      )
    })
    .catch(err =>
      dispatch(action('RESOURCE_POST_ERROR', { message: err.message }))
    )
}

resources.doPutResource = resource => ({ dispatch, apiFetch }) => {
  dispatch({ type: 'RESOURCE_PUT_STARTED' })
  return apiFetch('/resources/' + resource._id, {
    method: 'PUT',
    body: JSON.stringify(resource)
  })
    .then(result => {
      if (not(result.ok)) {
        return dispatch(action('RESOURCE_PUT_ERROR', result))
      }
      return dispatch(
        action(
          'RESOURCE_PUT_FINISHED',
          merge(resource, { _id: result.id, _rev: result.rev })
        )
      )
    })
    .catch(err =>
      dispatch(action('RESOURCE_PUT_ERROR', { message: err.message }))
    )
}

resources.doRemoveResource = resource => ({ dispatch, apiFetch }) => {
  dispatch({ type: 'RESOURCE_REMOVE_STARTED' })
  return apiFetch('/resources/' + resource._id, {
    method: 'DELETE',
    body: JSON.stringify(resource)
  })
    .then(result => {
      if (not(result.ok)) {
        return dispatch(action('RESOURCE_REMOVE_ERROR', result))
      }
      return dispatch(
        action(
          'RESOURCE_REMOVE_FINISHED',
          merge(resource, { _id: result.id, _rev: result.rev })
        )
      )
    })
    .catch(err =>
      dispatch(action('RESOURCE_REMOVE_ERROR', { message: err.message }))
    )
}
export default resources

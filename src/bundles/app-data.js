export default {
  name: 'appData',
  reducer: (state = { title: 'BeepBoop' }, action) => {
    if (action.type === 'TITLE_CHANGED') {
      state.title = action.payload
    }
    return state
  },
  doChangeTitle: title => ({ dispatch }) =>
    dispatch({ type: 'TITLE_CHANGED', payload: title }),
  selectTitle: ({ appData }) => {
    return appData.title
  }
}

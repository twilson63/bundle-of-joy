import React from 'react'
import { Provider } from 'redux-bundler-react'
import Layout from './layout'

export default store => (
  <Provider store={store}>
    <Layout />
  </Provider>
)

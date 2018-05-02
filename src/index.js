import 'tachyons'
import ReactDOM from 'react-dom'

import getStore from './bundles'
import root from './components/root'
import cache from './utils/cache'

cache.getAll().then(initialData => {
  if (initialData) {
    console.log('starting with locally cache data:', initialData)
  }
  ReactDOM.render(root(getStore(initialData)), document.getElementById('root'))
})

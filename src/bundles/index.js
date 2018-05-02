import { composeBundles, createCacheBundle, appTimeBundle } from 'redux-bundler'
import routes from './routes'
import extraArgs from './extra-args'
import cache from '../utils/cache'
import resources from './resources'
import appData from './app-data'

export default composeBundles(
  routes,
  resources,
  appData,
  createCacheBundle(cache.set),
  extraArgs,
  appTimeBundle
)

import { createRouteBundle } from 'redux-bundler'
import Home from '../components/pages/home'
import Resources from '../components/pages/resources'
import Resource from '../components/pages/showResource'

export default createRouteBundle({
  '/': Home,
  '/resources': Resources,
  '/resources/:id': Resource
})

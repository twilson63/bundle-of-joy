import React from 'react'
import { connect } from 'redux-bundler-react'
import { map } from 'ramda'

const li = resource => (
  <li key={resource._id}>
    <a href={`/resources/${resource._id}`}>{resource.name}</a>
  </li>
)

const Resources = ({ resources }) => (
  <div>
    <h1>Resources</h1>
    {resources && map(li, resources)}
  </div>
)

export default connect('selectResources', Resources)

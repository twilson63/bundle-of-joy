import React from 'react'
import { connect } from 'redux-bundler-react'

const Resource = ({ activeResource }) => {
  if (!activeResource) {
    return <div>Not Found!</div>
  }
  return (
    <div>
      <h1>Resource</h1>
      <h2>{activeResource.name}</h2>
      <pre>
        <code>{JSON.stringify(activeResource, null, 2)}</code>
      </pre>
    </div>
  )
}

export default connect('selectActiveResource', Resource)

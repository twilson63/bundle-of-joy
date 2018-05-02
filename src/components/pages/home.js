import React from 'react'
import { connect } from 'redux-bundler-react'

const Home = ({ title, doChangeTitle }) => (
  <div>
    <h1>{title}</h1>
    <button onClick={e => doChangeTitle('Pizza Steve!!!')}>Chg Title</button>
  </div>
)

export default connect('selectTitle', 'doChangeTitle', Home)

import React from 'react'
import { connect } from 'redux-bundler-react'
import navHelper from 'internal-nav-helper'

const Layout = ({ doUpdateUrl, route, pathname }) => {
  const navItems = [
    { url: '/', label: 'Home' },
    { url: '/resources', label: 'Resources' }
  ]

  const Page = route
  return (
    <main
      className="ph3 ph4-ns pt3 bt b--black-10 black-60"
      onClick={navHelper(doUpdateUrl)}
    >
      <nav className="pa3 pa4-ns">
        <p className="avenir b f3 tc f2-ns black-70 lh-solid mb0">
          bundle of joy
        </p>
        <div className="tc pb3">
          {navItems.map(item => {
            return (
              <a
                className={`link dim gray f6 f5-ns dib pa2 mr1 ${
                  item.url === pathname ? 'bg-lightest-blue' : ''
                }`}
                href={item.url}
                key={item.url}
              >
                {item.label}
              </a>
            )
          })}
        </div>
      </nav>
      <Page />
    </main>
  )
}

export default connect('selectRoute', 'selectPathname', 'doUpdateUrl', Layout)

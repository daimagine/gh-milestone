import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Link } from 'react-router'

class OrganizationList extends Component {
  render () {
    const { list, error, processing } = this.props.orgs
    const errorContent = <p>{error}</p>
    let listContent = <p>no organization data</p>
    if (processing) {
      listContent = <p>fetching organization data...</p>
    } else if (list && list.length > 0) {
      listContent = (
        <ul>
          { list.map((org) => {
            return (
              <li key={org.id}>
                <Link to={`/orgs/${org.login}`}>{org.login}</Link>
              </li>
            )
          }) }
        </ul>
      )
    }
    let refreshButton = <span></span>
    if (!processing) {
      refreshButton = (
        <button onClick={() => this.props.refresh()}>
          refresh
        </button>
      )
    }
    return (
      <div>
        <h3>organizations</h3>
        { errorContent }
        { listContent }
        { refreshButton }
      </div>
    )
  }
}

OrganizationList.propTypes = {
  orgs: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
}

export default injectIntl(OrganizationList)

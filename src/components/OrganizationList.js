import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

class OrganizationList extends Component {
  render () {
    const { list, error, processing } = this.props.orgs
    const errorContent = <p>{error}</p>
    let listContent = <p>no organization data</p>
    if (processing) {
      listContent = <p>fetching organization data</p>
    } else if (list && list.length > 0) {
      listContent = (
        <ul>
          { list.map((org, idx) => {
            return (
              <li key={idx}>
                {org}
              </li>
            )
          }) }
        </ul>
      )
    }
    return (
      <div>
        { errorContent }
        { listContent }
        <button onClick={() => this.props.refresh()}>
          refresh
        </button>
      </div>
    )
  }
}

OrganizationList.propTypes = {
  orgs: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
}

export default injectIntl(OrganizationList)

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as orgsActions } from 'redux/modules/orgs'
import OrganizationList from 'components/OrganizationList'

const mapStateToProps = (state) => ({
  auth: state.auth,
  orgs: state.orgs
})

export class OrganizationView extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    orgs: PropTypes.object.isRequired,
    fetchOrganizations: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { fetchOrganizations } = this.props
    fetchOrganizations()
  }

  render () {
    const { user } = this.props.auth
    const { orgs, fetchOrganizations } = this.props
    return (
      <div className='container'>
        <h1>Welcome, {user.name}</h1>
        <OrganizationList
          orgs={orgs}
          refresh={fetchOrganizations}/>
      </div>
    )
  }
}

export default connect(mapStateToProps, Object.assign({},
  orgsActions
))(OrganizationView)

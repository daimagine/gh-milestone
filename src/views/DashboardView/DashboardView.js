import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  auth: state.auth
})

export class DashboardView extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  render () {
    const {user} = this.props.auth
    return (
      <div className='container'>
        <h1>Welcome, {user.name}</h1>
      </div>
    )
  }
}

export default connect(mapStateToProps)(DashboardView)

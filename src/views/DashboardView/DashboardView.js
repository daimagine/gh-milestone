import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  user: state.user
})

export class DashboardView extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render () {
    const {user} = this.props
    return (
      <div className='container'>
        <h1>Welcome, {user.name}</h1>
      </div>
    )
  }
}

export default connect(mapStateToProps)(DashboardView)

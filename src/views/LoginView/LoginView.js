import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from 'redux/modules/auth'

const mapStateToProps = (state) => ({
  router: state.router,
  auth: state.auth
})

export class LoginView extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    authenticate: PropTypes.func.isRequired
  }

  componentDidMount () {
    const {router, authenticate} = this.props
    authenticate(router.location.query.code)
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-4 col-xs-offset-4'>
            <p>authenticating github credential..</p>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, Object.assign({},
  authActions
))(LoginView)

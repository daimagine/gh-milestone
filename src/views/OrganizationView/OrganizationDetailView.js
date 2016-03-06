import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { actions as orgsActions } from 'redux/modules/orgs'

const mapStateToProps = (state) => ({
  orgs: state.orgs
})

export class OrganizationDetailView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    orgs: PropTypes.object.isRequired,
    fetchOrganization: PropTypes.func.isRequired,
    fetchOrgRepos: PropTypes.func.isRequired
  }

  componentDidMount () {
    const {
      fetchOrganization,
      fetchOrgRepos
    } = this.props
    fetchOrganization(this.props.params.id)
    fetchOrgRepos(this.props.params.id)
  }

  render () {
    const { repos, milestones, processing } = this.props.orgs
    const org = this.props.orgs.detail
    let content = <div></div>
    if (processing) {
      content = <div>processing...</div>
    } else if (org) {
      let repoContent = <div>fetching repos...</div>
      if (repos) {
        repoContent = (
          <div>
            { repos.map((repo) => {
              let milestoneContent = <div></div>
              const miles = milestones[repo.id]
              if (miles) {
                milestoneContent = (
                  <div>
                    { miles.map((mile) => {
                      return (
                        <div key={mile.id}>
                          <h4>{mile.title} <a href={mile.html_url}>[link]</a></h4>
                          <dl>
                            <dt>open issues: {mile.open_issues}</dt>
                            <dt>closed issues: {mile.closed_issues}</dt>
                            { mile.due_on ? <dt>due on {mile.due_on}</dt> : '' }
                          </dl>
                        </div>
                      )
                    }) }
                  </div>
                )
              }
              return (
                <div key={repo.id}>
                  <h3>{repo.name} <a href={repo.html_url}>[link]</a></h3>
                  {milestoneContent}
                </div>
              )
            }) }
          </div>
        )
      }
      content = (
        <div>
          <h1>Orgz: {org.login}</h1>
          {repoContent}
        </div>
      )
    }
    return (
      <div className='container'>
        <Link to={'/'}>back to list</Link>
        {content}
      </div>
    )
  }
}

export default connect(mapStateToProps, Object.assign({},
  orgsActions
))(OrganizationDetailView)

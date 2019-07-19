import React from "react";
import { connect } from "react-redux";
import { fetchUser, fetchGroups } from "../../actions";

class FilterGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeOutClass: "alertContainer",
      user_groups: []
    };
  }

  componentWillMount() {
    this.props.fetchUser();
    this.group_details();
    this.props.fetchGroups();
  }

  //1************SEARCH FOR/RENDER GROUPS*************//
  /**
   * group_details: POST req for details for group details
   * renderList: JSX rendering user groups as buttons
   * setFilter: trigger parent function to render prayers by filter
   * exitPopup: exit filter popup
   **/
  group_details = async () => {
    const groups = this.props.groups;

    this.setState({
      user_groups: groups
    });
  };

  renderList = () => {
    if (this.state.user_groups.length > 0) {
      return this.state.user_groups.map(group => {
        return (
          <button
            key={group.acronym}
            value={group.acronym}
            onClick={this.setFilter}
            className="group"
          >
            [{group.acronym}] {group.name}
          </button>
        );
      });
    }
  };

  setFilter = e => {
    this.props.filterChange(e.target.value);

    this.exitPopup();
  };

  exitPopup = () => {
    this.setState({
      fadeOutClass: "alertContainer fadeOut"
    });
    setTimeout(() => {
      this.props.unmountMe();
    }, 1000);
  };

  render() {
    return (
      <div className={this.state.fadeOutClass}>
        <div className="filter_groups">
          <button onClick={this.exitPopup}>x</button>
          <p>Filter Groups</p>
          <div className="group_view">
            <button className="group" value="personal" onClick={this.setFilter}>
              view personal requests
            </button>
            {this.renderList()}
          </div>
          <form />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth, groups }) {
  return { auth, groups };
}

export default connect(
  mapStateToProps,
  { fetchUser, fetchGroups }
)(FilterGroups);

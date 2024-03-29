import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUser, fetchGroups, fetchFavGroups, fetchVerse } from "../actions";

import Menu from "./menu/Menu";
import Sidebar from "./menu/Sidebar";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: true
    };
  }

  componentWillMount() {
    this.props.fetchUser();
    this.props.fetchGroups(this.props.auth.groups);
    this.props.fetchFavGroups(this.props.auth.favGroups);
    this.props.fetchVerse();
  }

  render() {
    if (!this.props.auth) {
      return <Redirect push to={{ pathname: "/" }} replace />;
    }
    return (
      <div>
        <Sidebar />
        {this.state.menu && <Menu />}
      </div>
    );
  }
}

function mapStateToProps({ auth, groups }) {
  return { auth, groups };
}

export default connect(
  mapStateToProps,
  { fetchUser, fetchGroups, fetchFavGroups, fetchVerse }
)(Main);

import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser, fetchGroups, fetchFavGroups, fetchVerse } from "../actions";

import Menu from "./menu/Menu";
import Sidebar from "./menu/Sidebar";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: false,
      menu: true,
      user: props.user
    };
  }

  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchGroups(this.props.auth.groups);
    this.props.fetchFavGroups(this.props.auth.favGroups);
    this.props.fetchVerse();
    console.log(this.props);
  }

  render() {
    const fname = this.props.auth.firstName;

    return (
      <div>
        <Sidebar />
        {this.state.menu && <Menu fname={fname} />}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  { fetchUser, fetchGroups, fetchFavGroups, fetchVerse }
)(Main);

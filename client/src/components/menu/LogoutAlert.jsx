import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { connect } from "react-redux";
import { fetchUser } from "../../actions";

import "../../sass/logoutAlert.sass";

class LogoutAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logout: false
    };
    this.exitPopup = this.exitPopup.bind(this);
  }

  refreshUserData = async () => {
    let logoutUser = await axios.get("/api/logout");

    this.props.fetchUser();

    setTimeout(() => {
      this.setState({
        logout: true
      });
    }, 100);
  };

  exitPopup() {
    this.props.unmountMe();
  }

  render() {
    if (this.state.logout) {
      return <Redirect push to={{ pathname: "/" }} replace />;
    }
    return (
      <div className="alertContainer">
        <div className="logout">
          <p>Are you sure you want to logout?</p>
          <div className="logout__links">
            <button
              className="logout__links-yes"
              onClick={this.refreshUserData}
            >
              yes
            </button>
            <button className="logout__links-no" onClick={this.exitPopup}>
              no
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  { fetchUser }
)(LogoutAlert);

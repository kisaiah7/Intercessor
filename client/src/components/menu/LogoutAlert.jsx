import React from "react";

import "../../sass/logoutAlert.sass";

class LogoutAlert extends React.Component {
  constructor(props) {
    super(props);
    this.exitPopup = this.exitPopup.bind(this);
  }

  exitPopup() {
    this.props.unmountMe();
  }

  render() {
    return (
      <div className="alertContainer">
        <div className="logoutAlert">
          <p>Are you sure you want to logout?</p>
          <div className="links">
            <a className="logoutLink" href="/api/logout">
              yes
            </a>
            <button onClick={this.exitPopup}>no</button>
          </div>
        </div>
      </div>
    );
  }
}

export default LogoutAlert;

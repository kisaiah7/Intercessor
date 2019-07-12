import React from "react";
import "../../sass/settings/settings.sass";
import UserInfo from "./UserInfo";
import Groups from "./Groups";
import Timers from "./Timers";

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: true,
      groups: false,
      timer: false,
      fadeOutClass: "alertContainer",
      user_style: "selected",
      groups_style: "",
      timer_style: ""
    };
    this.exitPopup = this.exitPopup.bind(this);
    this.userInfo = this.userInfo.bind(this);
    this.groups = this.groups.bind(this);
    this.timer = this.timer.bind(this);
  }

  componentDidMount() {
    if (this.props.toGroups) {
      this.groups();
    } else if (this.props.toTimer) {
      this.timer();
    }
  }

  userInfo() {
    this.setState({
      userInfo: true,
      groups: false,
      timer: false,
      user_style: "selected",
      groups_style: "",
      timer_style: ""
    });
  }
  groups() {
    this.setState({
      userInfo: false,
      groups: true,
      timer: false,
      groups_style: "selected",
      user_style: "",
      timer_style: ""
    });
  }
  timer() {
    this.setState({
      userInfo: false,
      groups: false,
      timer: true,
      timer_style: "selected",
      user_style: "",
      groups_style: ""
    });
  }

  exitPopup() {
    this.setState({
      fadeOutClass: "alertContainer fadeOut"
    });
    setTimeout(() => {
      this.props.unmountMe();
    }, 1000);
  }

  render() {
    return (
      <div className={this.state.fadeOutClass}>
        <div className="settings__container">
          <div className="settings__sidelinks">
            <button className="settings-exitbtn" onClick={this.exitPopup}>
              x
            </button>
            <p>Settings</p>
            <button className={this.state.user_style} onClick={this.userInfo}>
              user-info
            </button>
            <button className={this.state.groups_style} onClick={this.groups}>
              group
            </button>
            <button className={this.state.timer_style} onClick={this.timer}>
              timer
            </button>
          </div>
          {this.state.userInfo && <UserInfo exit={this.exitPopup} />}
          {this.state.groups && <Groups />}
          {this.state.timer && <Timers exit={this.exitPopup} />}
        </div>
      </div>
    );
  }
}

export default Settings;

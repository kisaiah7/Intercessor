import React from "react";
import "../../sass/settings/settings.sass";
import UserInfo from "./UserInfo";
import Groups from "./Groups";
import Timers from "./Timers";
import Credits from "./Credits";

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: true,
      groups: false,
      timer: false,
      credits: false,
      fadeOutClass: "alertContainer",
      user_style: "selected",
      groups_style: "",
      timer_style: "",
      credits_style: ""
    };
    this.exitPopup = this.exitPopup.bind(this);
    this.userInfo = this.userInfo.bind(this);
    this.groups = this.groups.bind(this);
    this.timer = this.timer.bind(this);
    this.credits = this.credits.bind(this);
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
      credits: false,
      user_style: "selected",
      groups_style: "",
      timer_style: "",
      credits_style: ""
    });
  }
  groups() {
    this.setState({
      userInfo: false,
      groups: true,
      timer: false,
      credits: false,
      groups_style: "selected",
      user_style: "",
      timer_style: "",
      credits_style: ""
    });
  }
  timer() {
    this.setState({
      userInfo: false,
      groups: false,
      timer: true,
      credits: false,
      timer_style: "selected",
      user_style: "",
      groups_style: "",
      credits_style: ""
    });
  }
  credits() {
    this.setState({
      userInfo: false,
      groups: false,
      timer: false,
      credits: true,
      timer_style: "",
      user_style: "",
      groups_style: "",
      credits_style: "selected"
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
          <div className="settings__sidebar">
            <div className="settings__sidebar__header">
              <button
                className="settings__sidebar__header-exitbtn"
                onClick={this.exitPopup}
              >
                x
              </button>
              <p className="settings__sidebar__header-heading">Settings</p>
            </div>
            <div className="settings__sidebar__sidelinks">
              <button className={this.state.user_style} onClick={this.userInfo}>
                user-info
              </button>
              <button className={this.state.groups_style} onClick={this.groups}>
                group
              </button>
              <button className={this.state.timer_style} onClick={this.timer}>
                timer
              </button>
              <button
                className={this.state.credits_style}
                onClick={this.credits}
              >
                credits
              </button>
            </div>
          </div>
          {this.state.userInfo && <UserInfo exit={this.exitPopup} />}
          {this.state.groups && <Groups />}
          {this.state.timer && <Timers exit={this.exitPopup} />}
          {this.state.credits && <Credits exit={this.exitPopup} />}
        </div>
      </div>
    );
  }
}

export default Settings;

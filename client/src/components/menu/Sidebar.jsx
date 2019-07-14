import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { fetchUser } from "../../actions";

import LogoutAlert from "./LogoutAlert";
import Settings from "../settings/Settings";

import "../../sass/sidebar.sass";
import { Link } from "react-router-dom";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      logout_popup: false,
      settings_popup: false,
      color: "sideBar " + props.page,
      checked: false
    };

    this.popup = this.popup.bind(this);
    this.exitPopup = this.exitPopup.bind(this);
  }

  renderUserTheme = () => {
    if (this.props.auth.theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      this.setState({
        checked: true
      });
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      this.setState({
        checked: false
      });
    }
  };

  toggleTheme = e => {
    this.setState(
      prevState => {
        return { checked: !prevState.checked };
      },
      async () => {
        if (this.state.checked) {
          document.documentElement.setAttribute("data-theme", "dark");
          await axios.post("/api/user_theme", {
            theme: "dark"
          });
          this.props.fetchUser();
        } else {
          document.documentElement.setAttribute("data-theme", "light");
          await axios.post("/api/user_theme", {
            theme: "light"
          });
          this.props.fetchUser();
        }
      }
    );
  };

  clockRender() {
    let hour = this.state.date.getHours();
    let minute = this.state.date.getMinutes();
    let suffix = "AM";

    if (hour > 12) {
      hour -= 12;
      suffix = "PM";
    } else if (hour === 0) {
      hour = 12;
    }

    if (this.state.date.getMinutes() < 10) {
      minute = "0" + minute;
    }
    return hour + ":" + minute + suffix;
  }

  componentDidMount() {
    this.props.fetchUser();
    this.timerID = setInterval(() => this.tick(), 60000);
    this.renderUserTheme();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  popup(e) {
    if (e.target.id === "logout") {
      this.setState({
        logout_popup: true
      });
    } else if (e.target.id === "settings") {
      this.setState({
        settings_popup: true
      });
    }
  }

  exitPopup() {
    this.setState({
      logout_popup: false,
      settings_popup: false
    });
  }

  render() {
    return (
      <div>
        <div className={this.state.color}>
          <div className="theme-switch-wrapper">
            <label className="theme-switch" htmlFor="checkbox">
              <input
                type="checkbox"
                onChange={this.toggleTheme}
                id="checkbox"
                checked={!!this.state.checked}
              />
              <div className="slider round" />
            </label>
          </div>
          <p className="time">{this.clockRender()}</p>
          <Link to={"/menu"} className="back">
            menu
          </Link>
          <p id="settings" className="link" onClick={this.popup}>
            settings
          </p>
          <p id="logout" className="link" onClick={this.popup}>
            logout
          </p>
        </div>
        {this.state.logout_popup ? (
          <LogoutAlert unmountMe={this.exitPopup} />
        ) : null}
        {this.state.settings_popup ? (
          <Settings unmountMe={this.exitPopup} />
        ) : null}
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
)(Sidebar);

import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../../actions";

import Settings from "../settings/Settings";
import Sidebar from "../menu/Sidebar";

import "../../sass/notice.sass";

class Notice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      onClick: " ",
      btnText: " ",
      settings_popup: false
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 25000);
    this.props.fetchUser();
    this.setTimer();
  }

  componentDidUpdate() {
    this.props.fetchUser();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  setTimer() {
    this.setState({
      timer: this.props.auth.timer,
      btnText: this.props.auth.timer + " minutes"
    });
  }

  tick() {
    if (this.state.timer > 0.25) {
      this.setState(prevState => {
        return {
          timer: prevState.timer - 0.25,
          btnText: prevState.timer - 0.25 + " minutes"
        };
      });
    } else if (this.state.timer <= 0.25) {
      this.setState({
        btnText: "enter >",
        onClick: this.props.exit
      });
    } else if (this.state.timer <= 1) {
      this.setState(prevState => {
        return {
          timer: prevState.timer - 0.25,
          btnText: prevState.timer - 0.25 + " minute"
        };
      });
    }
  }

  popup = () => {
    this.setState({
      settings_popup: true
    });
  };

  exitPopup = () => {
    this.setState({
      settings_popup: false
    });
  };

  render() {
    return (
      <div className="noticeContainer">
        {this.state.settings_popup ? (
          <Settings unmountMe={this.exitPopup} toTimer={true} />
        ) : null}
        <Sidebar onClick={this.toMenu} page="forMe" />

        <div className="forMe__notice">
          <div className="forMe__notice-top">
            <div className="forMe__notice-top-left">
              <p>
                <i>Selah</i>
              </p>
            </div>
            <div className="forMe__notice-top-right">
              <p>
                <i>
                  <br />
                  <br />
                  <br />
                  <br />
                  Before you procede to ask others for prayer, take a moment to
                  ask God for discernment, clarity, and humility.
                  <br />
                  <br />
                  <br />
                  <br />
                  <span onClick={this.popup}>edit timer</span>
                </i>
              </p>
            </div>
          </div>
          <button className="forMe__notice-bottom" onClick={this.state.onClick}>
            {this.state.btnText}
          </button>
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
)(Notice);

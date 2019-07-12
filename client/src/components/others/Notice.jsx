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
    this.timerID = setInterval(() => this.tick(), 1000);
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
    if (this.state.timer > 0.01) {
      this.setState(prevState => {
        return {
          timer: prevState.timer - 0.01,
          btnText: prevState.timer - 0.01 + " minutes"
        };
      });
    } else if (this.state.timer <= 0.01) {
      this.setState({
        btnText: "enter >",
        onClick: this.props.exit
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
        <Sidebar onClick={this.toMenu} page="others" />
        <div className="others__notice">
          <div className="others__notice-top">
            <div className="others__notice-top-left">
              <p>
                <i>Selah</i>
              </p>
            </div>
            <div className="others__notice-top-right">
              <p>
                <i>
                  <br />
                  <br />
                  <br />
                  <br />
                  Before you procede to take on the burdens of others, take a
                  moment to ask God for strength, wisdom, and faith.
                  <br />
                  <br />
                  <br />
                  <br />
                  <span onClick={this.popup}>edit timer</span>
                </i>
              </p>
            </div>
          </div>

          <button
            className="others__notice-bottom"
            onClick={this.state.onClick}
          >
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

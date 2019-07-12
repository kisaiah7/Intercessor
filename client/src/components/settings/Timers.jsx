import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { fetchUser } from "../../actions";

import "../../sass/settings/timers.sass";

class Timers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timerSec: "",
      timerMin: "",
      btnText: "submit"
    };
  }

  componentDidMount() {
    this.props.fetchUser();
    this.setTimer();
  }

  setTimer() {
    const { timer } = this.props.auth;

    if (timer === 0) {
      return this.setState({
        timerMin: 0,
        timerSec: "0"
      });
    }

    this.setState({
      timerMin: Math.floor(timer),
      timerSec: (timer % 1).toString()
    });
  }

  onSubmit = async () => {
    let { timerMin, timerSec } = this.state;
    let timer = parseInt(timerMin);

    if (timerMin === "" || !timerSec) {
      return this.setState({
        btnText: "Timer must be set."
      });
    }

    const email = this.props.auth.email;

    switch (timerSec) {
      case "0":
        break;
      case "0.25":
        timer += 0.25;
        break;
      case "0.5":
        timer += 0.5;
        break;
      case "0.75":
        timer += 0.75;
        break;
      default:
        break;
    }

    const updateUser = await axios.post("/api/user_timer", {
      timer,
      email
    });

    if (updateUser.data.success) {
      this.setState({
        btnText: updateUser.data.message,
        success: true
      });
      this.props.exit();
    } else {
      this.setState({
        btnText: updateUser.data.message
      });
      this.resetSubmitBtn();
    }
  };

  onMinChange = e => {
    this.setState({
      timerMin: e.target.value
    });
  };
  onSecChange = e => {
    this.setState({
      timerSec: e.target.value
    });
  };
  resetSubmitBtn = e => {
    setTimeout(() => {
      this.setState(() => ({
        btnText: "submit"
      }));
    }, 4000);
  };

  render() {
    return (
      <div className="settings__timer">
        <form>
          <p className="settings__timer__header">set timer for Selah</p>
          <div className="settings__timer__form">
            <input
              className="settings__timer__form__field"
              type="number"
              value={this.state.timerMin}
              onChange={this.onMinChange}
              min="0"
            />
            <p>Minutes</p>
          </div>
          <div className="settings__timer__form">
            <input
              className="timerMin"
              name="timerMin"
              id="radio1"
              type="radio"
              value="0"
              checked={this.state.timerSec === "0"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio1">00</label>

            <input
              className="timerMin"
              name="timerMin"
              id="radio2"
              type="radio"
              value="0.25"
              checked={this.state.timerSec === "0.25"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio2">15</label>

            <input
              className="timerMin"
              name="timerMin"
              id="radio3"
              type="radio"
              value="0.5"
              checked={this.state.timerSec === "0.5"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio3">30</label>

            <input
              className="timerMin"
              name="timerMin"
              id="radio4"
              type="radio"
              value="0.75"
              checked={this.state.timerSec === "0.75"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio4">45</label>
            <p>Seconds</p>
          </div>
        </form>

        <button
          className="settings__timer__form-submitbtn"
          onClick={this.onSubmit}
        >
          {this.state.btnText}
        </button>
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
)(Timers);

import React, { Component } from "react";

import "../../sass/sanctuary/infobar.sass";

class InfoBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timerRaw: null,
      topicsText: ""
    };
  }

  displayName = () => {
    if (this.props.name) {
      return (
        <p className="infoBar__inherit__name">
          {this.props.name}
          {"'s prayer request:"}
        </p>
      );
    } else {
      return <p className="infoBar__inherit__name">{"your prayer request:"}</p>;
    }
  };

  /**
    TIMER
  **/
  componentWillMount() {
    this.timerID = setInterval(() => this.tick(), 15000);
    this.setTimer();

    if (this.props.topicsText.length < 1) {
      return this.setState({
        topicsText: "letting the Spirit lead"
      });
    }
    this.setState({
      topicsText: this.props.topicsText
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  setTimer() {
    if (this.props.timer === 0) {
      return this.setState({
        timerRender: "letting the Spirit lead"
      });
    }
    this.setState({
      timerRaw: this.props.timer,
      timerRender: this.props.timer + " minutes"
    });
  }

  tick() {
    if (this.state.timerRaw > 0.25) {
      this.setState(prevState => {
        return {
          timerRaw: prevState.timerRaw - 0.25,
          timerRender: prevState.timerRaw - 0.25 + " minutes"
        };
      });
    } else if (this.state.timerRaw === 0.25) {
      this.setState({
        timerRender: "timer finished"
      });
    }
  }
  /**
    END TIMER
  **/

  render() {
    return (
      <div className="infoBar">
        <div className="infoBar__timer">
          <p className="infoBar__timer-heading">timer:</p>
          <p className="infoBar__timer-timer">{this.state.timerRender}</p>
        </div>
        <div className="infoBar__topics">
          <p className="infoBar__topics-heading">prayer topics:</p>
          <p className="infoBar__topics-topics">{this.state.topicsText}</p>

          {this.props.body !== "" && this.displayName()}
          <p className="infoBar__inherit__body"> {this.props.body}</p>
        </div>
      </div>
    );
  }
}

export default InfoBar;

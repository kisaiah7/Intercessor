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
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 25000);
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

  tick() {
    if (this.state.timerRaw !== 1 && this.state.timerRaw > 0) {
      this.setState(prevState => {
        return {
          timerRaw: prevState.timerRaw - 0.25,
          timerRender: prevState.timerRaw - 0.25 + " minutes"
        };
      });
    }
    if (this.state.timerRaw === 1) {
      this.setState(prevState => {
        return {
          timerRaw: prevState.timerRaw - 0.25,
          timerRender: prevState.timerRaw - 0.25 + " minute"
        };
      });
    }
    if (this.state.timerRaw === 0) {
      this.setState({
        timerRender: "timer finished"
      });
    }
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

  /**
    END TIMER
  **/

  render() {
    const { inherited } = this.state;
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

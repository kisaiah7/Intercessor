import React, { Component } from "react";

class Prompt extends Component {
  constructor() {
    super();

    this.state = {
      timerSec: "",
      timerMin: "",
      topicsText: "",
      toggleTimerForm: false,
      toggleTopicsForm: false,
      timerChoice: null,
      topicsChoice: null,
      timerBtnText: "set prayer timer",
      fadeOutClass: "prompt fadeIn"
    };
  }

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

  onTopicsChange = e => {
    this.setState({
      topicsText: e.target.value
    });
  };

  toggleTimer = () => {
    this.setState({
      toggleTimerForm: true,
      toggleTopicsForm: false
    });
  };

  toggleTopics = () => {
    this.setState({
      toggleTopicsForm: true,
      toggleTimerForm: false
    });
  };

  displayMenuForm = () => {
    if (!this.state.toggleTimerForm && !this.state.toggleTopicsForm) {
      return (
        <div>
          {this.displayTimerChoice()}
          {this.displayTopicsChoice()}
        </div>
      );
    }
  };

  displayTimerChoice = () => {
    if (this.state.timerChoice === null) {
      return (
        <div className="prompt__timer">
          <button className="prompt__timer-button" onClick={this.toggleTimer}>
            set timer
          </button>
          <p> OR </p>
          <button
            className="prompt__timer-button"
            onClick={() => this.onTimerChoice("spirit")}
          >
            let the Spirit lead
          </button>
        </div>
      );
    } else if (this.state.timerChoice === "spirit") {
      return (
        <div className="prompt__timer">
          <p className="prompt__timer-selected">letting the Spirit lead</p>
        </div>
      );
    } else if (this.state.timerChoice === "set") {
      return (
        <div className="prompt__timer">
          <p className="prompt__timer-selected">timer set</p>
        </div>
      );
    }
  };

  displayTopicsChoice = () => {
    if (this.state.topicsChoice === null) {
      return (
        <div className="prompt__topics">
          <button className="prompt__timer-button" onClick={this.toggleTopics}>
            set topics
          </button>
          <p> OR </p>
          <button
            className="prompt__timer-button"
            onClick={() => this.onTopicsChoice("spirit")}
          >
            let the Spirit lead
          </button>
        </div>
      );
    } else if (this.state.topicsChoice === "set") {
      return (
        <div className="prompt__topics">
          <p className="prompt__topics-selected">topics set</p>
        </div>
      );
    } else if (this.state.topicsChoice === "spirit") {
      return (
        <div className="prompt__topics">
          <p className="prompt__topics-selected">letting the Spirit lead</p>
        </div>
      );
    }
  };

  displayTimerForm = () => {
    if (this.state.toggleTimerForm) {
      return (
        <div className="prompt__setTimer" style={{ borderBottom: "none" }}>
          <p className="prompt__setTimer-heading">set timer</p>
          <button
            className="prompt__setTimer-backBtn"
            onClick={() => {
              this.setState({ toggleTimerForm: false });
            }}
          >
            {"<"}
          </button>
          <div className="prompt__setTimer__minsec">
            <input
              className="prompt__setTimer__minsec-input"
              type="number"
              value={this.state.timerMin}
              onChange={this.onMinChange}
              min="0"
              placeholder="5"
            />
            <p>min</p>
          </div>
          <div className="prompt__setTimer__minsec">
            <input
              name="timerMin"
              id="radio1"
              type="radio"
              value="0"
              checked={this.state.timerSec === "0"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio1">00</label>

            <input
              name="timerMin"
              id="radio2"
              type="radio"
              value="0.25"
              checked={this.state.timerSec === "0.25"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio2">15</label>

            <input
              name="timerMin"
              id="radio3"
              type="radio"
              value="0.5"
              checked={this.state.timerSec === "0.5"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio3">30</label>

            <input
              name="timerMin"
              id="radio4"
              type="radio"
              value="0.75"
              checked={this.state.timerSec === "0.75"}
              onChange={this.onSecChange}
            />
            <label htmlFor="radio4">45</label>
            <p>sec</p>
          </div>
          <button
            className="prompt__setTimer-setBtn"
            onClick={this.onTimerSubmit}
          >
            {this.state.timerBtnText}
          </button>
        </div>
      );
    }
  };

  displayTopicsForm = () => {
    if (this.state.toggleTopicsForm) {
      return (
        <div className="prompt__setTopics">
          <button
            className="prompt__setTopics-backBtn"
            onClick={() => {
              this.setState({ toggleTopicsForm: false });
            }}
          >
            {"<"}
          </button>
          <p className="prompt__setTopics-heading">prayer topics</p>
          <textarea
            className="prompt_setTopics textarea"
            value={this.state.topicsText}
            onChange={this.onTopicsChange}
          />
          <button
            className="prompt__setTopics-setBtn"
            onClick={this.onTopicsSubmit}
          >
            set prayer topics
          </button>
        </div>
      );
    }
  };

  onTimerChoice = choice => {
    if (choice === "spirit") {
      this.setState({
        timerChoice: "spirit"
      });
    }
    if (this.state.topicsChoice) {
      this.setState({
        fadeOutClass: "prompt fadeOut"
      });
      setInterval(() => {
        this.props.togglePrompt();
      }, 1000);
    }
  };

  onTopicsChoice = choice => {
    if (choice === "spirit") {
      this.setState({
        topicsChoice: "spirit"
      });
    } else if (choice === "set") {
      this.setState({
        topicsChoice: "set"
      });
    }
    if (this.state.timerChoice) {
      this.setState({
        fadeOutClass: "prompt fadeOut"
      });
      setInterval(() => {
        this.props.togglePrompt();
      }, 1000);
    }
  };

  onTimerSubmit = () => {
    let { timerMin, timerSec } = this.state;
    let timer = parseInt(timerMin);

    if (timerMin === "" || !timerSec) {
      return this.setState({
        timerBtnText: "timer must be set"
      });
    }

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

    this.setState({
      timerChoice: "set",
      toggleTimerForm: false
    });
    this.onTimerChoice();
    this.props.setTimer(timer);
  };

  onTopicsSubmit = () => {
    this.setState({
      topicsChoice: "set",
      toggleTopicsForm: false
    });
    this.onTopicsChoice();
    this.props.setTopics(this.state.topicsText);
  };

  render() {
    return (
      <div className={this.state.fadeOutClass}>
        {this.displayMenuForm()}
        {this.displayTimerForm()}
        {this.displayTopicsForm()}
      </div>
    );
  }
}

export default Prompt;

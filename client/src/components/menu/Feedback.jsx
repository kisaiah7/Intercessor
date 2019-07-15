import React, { Component } from "react";
import axios from "axios";

import "../../sass/feedback.sass";

class Feedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeOutClass: "alertContainer",
      feedback: ""
    };
    this.exitPopup = this.exitPopup.bind(this);
  }

  exitPopup() {
    this.setState({
      fadeOutClass: "alertContainer fadeOut"
    });
    setTimeout(() => {
      this.props.unmountMe();
    }, 1000);
  }

  onFeedbackChange = e => {
    this.setState({
      feedback: e.target.value
    });
  };

  onSubmit = async () => {
    const { feedback } = this.state;
    await axios.post("/api/feedback", { feedback });
  };

  render() {
    return (
      <div className={this.state.fadeOutClass}>
        <div className="feedback">
          <button className="feedback-exitbtn" onClick={this.exitPopup}>
            x
          </button>
          <p className="feedback__header">
            hello, beta-tester. please provide feedback for your fellow brother
            in Christ!
          </p>
          <form className="feedback__form">
            <textarea
              type="text"
              className="feedback__form__field"
              placeholder="feedback"
              value={this.state.feedback}
              onChange={this.onFeedbackChange}
            />
            <br />
            <button className="feedback__submitbtn" onClick={this.onSubmit}>
              submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Feedback;

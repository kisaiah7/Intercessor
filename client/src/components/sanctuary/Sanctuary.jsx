import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Typing from "react-typing-animation";

import Sidebar from "../menu/Sidebar";
import Prompt from "./Prompt";
import InfoBar from "./InfoBar";

import "../../sass/sanctuary/sanctuary.sass";

class Sanctuary extends Component {
  constructor() {
    super();

    this.state = {
      prompt: true,
      choicesSet: false,
      timer: 0,
      topicsText: "",
      inheritPrayer: "",
      verse: "",
      ref: "",
      inherit_name: "",
      inherit_body: ""
    };
  }

  componentDidMount = () => {
    console.log(this.props);
    this.setState({
      verse: this.props.verse.verse,
      ref: this.props.verse.ref
    });

    if (this.props.location.state) {
      this.setState({
        inherit_name: this.props.location.state.name,
        inherit_body: this.props.location.state.body
      });
    }
  };

  togglePrompt = () => {
    this.setState({
      prompt: false
    });
  };

  setTimer = timer => {
    this.setState({
      timer: timer
    });
  };

  setTopics = text => {
    this.setState({
      topicsText: text
    });
  };

  getBibleVerse = async () => {
    await axios.get("/api/get_verse");
  };

  render() {
    return (
      <div className="sanctuaryContainer">
        <Sidebar />
        {!this.state.prompt && (
          <InfoBar
            timer={this.state.timer}
            topicsText={this.state.topicsText}
            name={this.state.inherit_name}
            body={this.state.inherit_body}
          />
        )}
        {this.state.prompt && (
          <Prompt
            togglePrompt={this.togglePrompt}
            setTimer={this.setTimer}
            setTopics={this.setTopics}
          />
        )}
        <span className="window__top" />
        <span className="window__sill" />
        <div className="bibleverse">
          <Typing>
            <p className="bibleverse__verse">{this.state.verse}</p>
            <p className="bibleverse__ref">{this.state.ref}</p>
          </Typing>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ verse }) {
  return { verse };
}

export default connect(
  mapStateToProps,
  {}
)(Sanctuary);

import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import "../../sass/others.sass";

class PrayerDetail extends Component {
  constructor() {
    super();

    this.state = {
      exitTransition: "detailPrayer",
      date: "",
      title: "",
      body: "",
      user_name: "",
      userAcronym: "",
      user_gender: "",
      toSanctuary: false
    };
  }

  componentWillMount() {
    const {
      date,
      title,
      body,
      user_name,
      userAcronym,
      user_gender
    } = this.props;

    this.setState({
      date: date.substring(0, 10),
      title,
      body,
      user_name,
      userAcronym,
      user_gender
    });
  }

  exitDetail = () => {
    this.setState({
      exitTransition: "detailPrayer exitTransition"
    });
    setTimeout(() => {
      this.props.exit();
    }, 1000);
  };

  toSanctuary = () => {
    this.setState({
      toSanctuary: true
    });
  };

  render() {
    const { body, user_name } = this.state;

    if (this.state.toSanctuary) {
      return (
        <Redirect
          push
          to={{
            pathname: "/sanctuary",
            state: { body: body, name: user_name }
          }}
          replace
        />
      );
    }
    return (
      <div className={this.state.exitTransition}>
        <div className="detailPrayer__top">
          <button className="detailPrayer__top-exit" onClick={this.exitDetail}>
            {"<-"}
          </button>
          <div className="detailPrayer__top-date">
            <p>{this.state.date}</p>
          </div>
          <div className="detailPrayer__top-blurb">
            <p>
              [{this.state.userAcronym}] {this.state.user_name} >{" "}
              {this.state.title}
            </p>
          </div>
        </div>
        <div className="detailPrayer__bottom">
          <div className="detailPrayer__bottom-body">
            <p>{this.state.body}</p>
          </div>
          <div className="detailPrayer__bottom-btn" onClick={this.toSanctuary}>
            <p>
              {"I choose to intercede for my "}
              {this.state.user_gender}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PrayerDetail;

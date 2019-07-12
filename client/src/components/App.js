import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import LoginPage from "./Login";
import Main from "./Main";
import NewUser from "./login/NewUser";
import PrayerFeed from "./others/PrayerFeed";
import PrayerDetail from "./others/PrayerDetail";
import PrayerForm from "./forMe/PrayerForm";
import Santuary from "./sanctuary/Sanctuary";

import "../sass/index.sass";

class App extends Component {
  constructor() {
    super();

    this.state = {
      email: ""
    };
  }

  setEmail = email => {
    this.setState({
      email
    });
  };

  render() {
    return (
      <div className="appContainer">
        <div className="container">
          <BrowserRouter>
            <div>
              <Route
                exact
                path="/"
                render={() => <LoginPage setEmail={this.setEmail} />}
              />
              <Route path="/menu" component={Main} />
              <Route path="/newUser" component={NewUser} />
              <Route path="/others" component={PrayerFeed} />
              <Route path="/others/prayerDetail" component={PrayerDetail} />
              <Route path="/forMe" component={PrayerForm} />
              <Route path="/sanctuary" component={Santuary} />
            </div>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(App);

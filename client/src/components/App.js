import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUser } from "../actions";
import Typing from "react-typing-animation";

import LoginPage from "./Login.jsx";
import Main from "./Main";
import NewUser from "./login/NewUser";
import PrayerFeed from "./others/PrayerFeed";
import PrayerDetail from "./others/PrayerDetail";
import PrayerForm from "./forMe/PrayerForm";
import Santuary from "./sanctuary/Sanctuary";

import "../sass/index.sass";

class App extends Component {
  componentWillMount() {
    this.props.fetchUser();

    if (!this.props.auth) {
      return <Redirect push to={{ pathname: "/" }} replace />;
    }

    console.log("from APP", this.props.auth);
  }
  render() {
    return (
      <div className="appContainer">
        <div className="container">
          <BrowserRouter>
            <div>
              <Route exact path="/" render={() => <LoginPage />} />
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

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  { fetchUser }
)(App);

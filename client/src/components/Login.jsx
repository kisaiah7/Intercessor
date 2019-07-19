import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Typing from "react-typing-animation";

import Login from "./login/";
import Register from "./login/Register";

import { connect } from "react-redux";
import { fetchUser } from "../actions";

import "../sass/login.sass";

class LoginPage extends Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      newUser: false,
      loginStyle: "inputContainer invisible",
      greetingContainerStyle: "greetingContainer",
      greetingStyle: "greeting",
      greetingText: "Welcome,",
      titleBtnStyle: "titleBtn",
      titleBtnText: "proceed"
    };

    this.animateToLogin = this.animateToLogin.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleInputForm = this.toggleInputForm.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  componentWillMount() {
    this.props.fetchUser();

    console.log("login", this.props);
  }

  toggleTheme = e => {
    if (e.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  toggleForm(e) {
    if (e.target.outerText === "proceed") {
      this.animateToLogin();
    } else if (e.target.outerText === "register me") {
      this.toggleInputForm("register");
    } else if (e.target.outerText === "log me in") {
      this.toggleInputForm("login");
    }
  }

  animateToLogin() {
    this.setState({
      greetingContainerStyle: "greetingContainer moveToLeft",
      greetingStyle: "greeting fadeOutIn",
      titleBtnStyle: "titleBtn fadeOutIn"
    });
    setTimeout(() => {
      this.setState({
        loginStyle: "inputContainer fadeIn",
        titleBtnText: "register me",
        greetingText: "Login,"
      });
    }, 799);
  }

  toggleInputForm(to) {
    if (to === "register") {
      this.setState({
        greetingText: "Register,",
        titleBtnText: "log me in",
        greetingStyle: "greeting fadeOutIn",
        titleBtnStyle: "titleBtn fadeOutIn"
      });
    } else if (to === "login") {
      this.setState({
        greetingText: "Login,",
        titleBtnText: "register me",
        greetingStyle: "greeting fadeOutIn",
        titleBtnStyle: "titleBtn fadeOutIn"
      });
    }
  }

  login() {
    this.setState({
      loggedIn: true,
      newUser: false
    });
  }

  register() {
    this.setState({
      newUser: true,
      loggedIn: false
    });
  }

  render() {
    if (this.props.auth) {
      if (this.props.auth.newUser) {
        return (
          <Redirect
            push
            to={{ pathname: "/newUser", state: { user: this.props.auth } }}
            replace
          />
        );
      }
      return (
        <Redirect
          push
          to={{ pathname: "/menu", state: { user: this.props.auth } }}
          replace
        />
      );
    }
    return (
      <div className="loginContainer">
        <div className={this.state.greetingContainerStyle}>
          <div className={this.state.greetingStyle}>
            <div className="theme-switch-wrapper">
              <label className="theme-switch" htmlFor="checkbox">
                <input
                  type="checkbox"
                  onChange={this.toggleTheme}
                  id="checkbox"
                />
                <div className="slider round" />
              </label>
            </div>
            <Typing>
              {this.state.greetingText}
              <br />
              Intercessor
            </Typing>
          </div>
          <button
            className={this.state.titleBtnStyle}
            onClick={this.toggleForm}
          >
            <Typing speed={200}>
              <Typing.Delay ms={500} />
              {this.state.titleBtnText}
            </Typing>
          </button>
        </div>

        <div className={this.state.loginStyle}>
          {this.state.titleBtnText !== "log me in" && (
            <Login login={this.login} />
          )}
          {this.state.titleBtnText === "log me in" && <Register />}
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
)(LoginPage);

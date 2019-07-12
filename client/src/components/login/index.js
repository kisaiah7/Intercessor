import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      btnText: "login",
      email: "",
      password: "",
      success: false,
      user: null
    };
  }

  onChangeEmail = e => {
    this.setState({
      email: e.target.value
    });
  };

  onChangePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  resetLoginBtn = () => {
    setTimeout(() => {
      this.setState(() => ({
        btnText: "login"
      }));
    }, 4000);
  };

  onLogin = async () => {
    // Grab state
    let { email, password, user } = this.state;

    user = await axios.post("/api/login", {
      email: email,
      password: password
    });

    if (user.data.success) {
      this.setState({
        btnText: user.data.message,
        success: true,
        user: user.data.user
      });
    } else {
      this.setState({
        btnText: user.data.message
      });
      this.resetLoginBtn();
    }
  };

  render() {
    const { btnText, email, password, user } = this.state;

    if (this.state.success) {
      if (user.newUser) {
        return (
          <Redirect
            push
            to={{ pathname: "/newUser", state: { user: user } }}
            replace
          />
        );
      }
      return (
        <Redirect
          push
          to={{ pathname: "/menu", state: { user: user } }}
          replace
        />
      );
    }
    return (
      <div>
        <form className="form">
          <input
            type="email"
            id="email"
            name="email"
            className="form__field"
            placeholder="email address"
            value={email}
            onChange={this.onChangeEmail}
          />

          <input
            type="password"
            id="password"
            name="password"
            className="form__field"
            placeholder="password"
            value={password}
            onChange={this.onChangePassword}
          />
        </form>
        <div className="loginBtns">
          <a className="googleBtn" href="/auth/google">
            login with Google
          </a>

          <button className="loginBtn" type="submit" onClick={this.onLogin}>
            {btnText}
          </button>
        </div>
      </div>
    );
  }
}

export default Login;

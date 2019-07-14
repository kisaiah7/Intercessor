import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      btnText: "register",
      email: "",
      password: "",
      vpassword: "",
      success: false
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

  onChangeVPassword = e => {
    this.setState({
      vpassword: e.target.value
    });
  };

  resetRegisterBtn = () => {
    setTimeout(() => {
      this.setState(() => ({
        btnText: "register"
      }));
    }, 4000);
  };

  onRegister = async e => {
    e.preventDefault();
    // Grab state
    const { email, password, vpassword } = this.state;

    const user = await axios.post("/api/register", {
      email,
      password,
      vpassword
    });

    if (user.data.success) {
      this.setState({
        btnText: user.data.message,
        success: true
      });
    } else {
      this.setState({
        btnText: user.data.message
      });
      this.resetRegisterBtn();
    }
  };

  render() {
    const { btnText, email, password, vpassword } = this.state;

    if (this.state.success) {
      return <Redirect push to="/newUser" replace />;
    }

    return (
      <div>
        <form className="form" onSubmit={this.onRegister}>
          <input
            type="email"
            name="email"
            className="form__field"
            placeholder="email address"
            value={email}
            onChange={this.onChangeEmail}
          />
          <div className="rgPasswords">
            <input
              type="password"
              name="password"
              className="form__field"
              placeholder="password"
              value={password}
              onChange={this.onChangePassword}
            />
            <input
              type="password"
              className="form__field"
              placeholder="confirm password"
              value={vpassword}
              onChange={this.onChangeVPassword}
            />
          </div>
          <div className="loginBtns">
            <a className="googleBtn" href="/auth/google">
              register with Google
            </a>

            <button className="registerBtn" type="submit">
              {btnText}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;

import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { fetchUser } from "../../actions";
import "../../sass/settings/userInfo.sass";

class UserInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      acronym: "",
      fname: "",
      lname: "",
      email: "",
      currentPw: "",
      newPw: "",
      newVpw: "",
      btnText: "submit"
    };
  }

  componentWillMount() {
    const user = this.props.auth;

    this.setState({
      acronym: "acronym: " + user.acronym,
      fname: user.firstName,
      lname: user.lastName,
      email: user.email
    });
  }

  onSubmit = async () => {
    // Grab state
    const { fname, lname, email, currentPw, newPw, newVpw } = this.state;

    const user = await axios.post("/api/userInfo", {
      fname,
      lname,
      email,
      currentPw,
      newPw,
      newVpw
    });

    if (user.data.success) {
      this.setState({
        btnText: user.data.message,
        success: true
      });
      this.props.exit();
    } else {
      this.setState({
        btnText: user.data.message
      });
    }
    this.resetSubmitBtn();
  };

  onFNameChange = e => {
    this.setState({
      fname: e.target.value
    });
  };
  onLNameChange = e => {
    this.setState({
      lname: e.target.value
    });
  };
  onEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };
  onCurrentPWChange = e => {
    this.setState({
      currentPw: e.target.value
    });
  };
  onNewPWChange = e => {
    this.setState({
      newPw: e.target.value
    });
  };
  onNewVPWChange = e => {
    this.setState({
      newVpw: e.target.value
    });
  };
  resetSubmitBtn = e => {
    setTimeout(() => {
      this.setState(() => ({
        btnText: "submit"
      }));
    }, 4000);
  };

  render() {
    return (
      <div className="settings__userInfo">
        <p className="settings__userInfo__header">
          {this.props.auth.firstName} {this.props.auth.lastName}: a beloved
          child of God, saved by grace and faith alone, an
          <span> intercessor</span> for the nations
        </p>
        <form className="settings__userInfo__form">
          <input
            type="text"
            className="settings__userInfo__form__field email"
            placeholder="user acronym"
            value={this.state.acronym}
            onChange={this.onAcronymChange}
            disabled
          />
        </form>
        <form className="settings__userInfo__form">
          <input
            type="text"
            className="settings__userInfo__form__field"
            placeholder="first name"
            value={this.state.fname}
            onChange={this.onFNameChange}
          />
        </form>
        <form className="settings__userInfo__form">
          <input
            type="text"
            className="settings__userInfo__form__field"
            placeholder="last name"
            value={this.state.lname}
            onChange={this.onLNameChange}
          />
        </form>
        <form className="settings__userInfo__form">
          <input
            type="text"
            className="settings__userInfo__form__field email"
            placeholder="email address"
            value={this.state.email}
            onChange={this.onEmailChange}
            disabled
          />
        </form>
        <br />
        <label>change password</label>
        <form className="settings__userInfo__form">
          <input
            type="password"
            className="settings__userInfo__form__field"
            placeholder="current password"
            value={this.state.currentPw}
            onChange={this.onCurrentPWChange}
          />
        </form>
        <form className="settings__userInfo__form">
          <input
            type="password"
            className="settings__userInfo__form__field"
            placeholder="new password"
            value={this.state.newPw}
            onChange={this.onNewPWChange}
          />
        </form>
        <form className="settings__userInfo__form">
          <input
            type="password"
            className="settings__userInfo__form__field"
            placeholder="confirm new password"
            value={this.state.newVpw}
            onChange={this.onNewVPWChange}
          />
        </form>
        <button
          className="settings__userInfo__submitbtn"
          onClick={this.onSubmit}
        >
          {this.state.btnText}
        </button>
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
)(UserInfo);

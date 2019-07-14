import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { fetchUser } from "../../actions";

import "../../sass/settings/groupDetail.sass";

class GroupDetail extends Component {
  constructor() {
    super();

    this.state = {
      members: [],
      isFavorite: false,
      btn_text: "leave group"
    };
  }

  componentDidMount() {
    this.props.fetchUser();
    this.getMemberInfo();
    this.renderFavorite();
    this.renderBtn();
  }

  //****************RENDER GROUP DETAILS*****************//
  /**
   * renderFavorite: JSX render favorite button
   * renderBtn: JSX render leave/join group button
   * onPrivacyChange: POST req when privacy preference changes
   * onFavoriteChange: POST req when favorite preference changes
   ***! have to limit favorite list to 6 total
   * getUpdatedMemberList: POST req to get member list
   * getMemberInfo: POST req to get member details
   * renderMemberList: JSX rendering of member details
   * onSubmit: POST req to leave/join group
   **/

  //** button rendering **//

  renderFavorite = () => {
    const user_fav_groups = this.props.auth.favGroups;
    const current_group = this.props.group.acronym;
    if (user_fav_groups.includes(current_group)) {
      this.setState({
        isFavorite: true
      });
    } else {
      this.setState({
        isFavorite: false
      });
    }
  };

  renderBtn = () => {
    const group_members = this.props.group.members;
    const user = this.props.auth.acronym;

    if (group_members.includes(user)) {
      this.setState({
        btn_text: "leave group"
      });
    } else {
      this.setState({
        btn_text: "join group"
      });
    }
  };
  //** end button rendering **//

  onFavoriteChange = e => {
    const isFavorite = e.target.checked;
    const acronym = this.props.group.acronym;
    const user_email = this.props.auth.email;

    this.setState(
      prevState => ({
        isFavorite: !prevState.isFavorite
      }),
      async () => {
        if (this.state.isFavorite) {
          await axios.post("/api/favorite_group", {
            isFavorite,
            acronym
          });
          this.props.fetchUser();
        } else {
          await axios.post("/api/favorite_group", {
            isFavorite,
            acronym
          });
          this.props.fetchUser();
        }
      }
    );
  };

  getUpdatedMemberList = async () => {
    const group_acronym = this.props.group.acronym;

    const group_members_acronyms = await axios.post("/api/group_members", {
      group_acronym
    });

    this.getMemberInfo(group_members_acronyms.data.members);
  };

  getMemberInfo = async members => {
    let acronyms;

    console.log("GETTITT", members);
    if (members == null) {
      acronyms = this.props.group.members;
    } else {
      acronyms = members;
    }

    const member_info = await axios.post("/api/member_info", {
      acronyms
    });

    if (member_info.data.success) {
      this.setState({
        members: member_info.data.user
      });
    }
  };

  renderMemberList = () => {
    return this.state.members.map(member => {
      return (
        <p key={member[0].acronym} className="member_info">
          [{member[0].acronym}] {member[0].firstName} {member[0].lastName},{" "}
          {member[0].email}
        </p>
      );
    });
  };

  onSubmit = async () => {
    const group_acronym = this.props.group.acronym;
    const user_acronym = this.props.auth.acronym;

    if (this.state.btn_text === "leave group") {
      const leave_group = await axios.post("/api/leave_group", {
        group_acronym,
        user_acronym
      });

      if (leave_group.data.success) {
        console.log("LEAVE");
        this.setState({
          btn_text: "join group"
        });
        this.getUpdatedMemberList();
      }
    } else {
      const join_group = await axios.post("/api/join_group", {
        group_acronym,
        user_acronym
      });
      if (join_group.data.success) {
        this.setState({
          btn_text: "leave group"
        });
        this.getUpdatedMemberList();
      }
    }
    this.props.fetchUser();
  };

  render() {
    return (
      <div className="groupDetailContainer">
        <div className="group_title">
          <input
            type="text"
            className="group_acronym"
            placeholder={this.props.group.acronym}
            disabled
          />
          <input
            type="text"
            className="group_name"
            placeholder={this.props.group.name}
            disabled
          />
        </div>
        <div className="group_buttons-top">
          <form className="favorite">
            <input
              type="checkbox"
              id="favorite"
              className="favorite"
              onChange={this.onFavoriteChange}
              checked={this.state.isFavorite}
            />
            <label htmlFor="favorite">favorite group</label>
          </form>
        </div>
        <p className="group_description">{this.props.group.description}</p>
        <div className="group_members">
          <p className="group_members_title">member list:</p>
          {this.renderMemberList()}
        </div>

        <button className="group_leave" onClick={this.onSubmit}>
          {this.state.btn_text}
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
)(GroupDetail);

import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { fetchUser, fetchGroups } from "../../actions";
import "../../sass/settings/groups.sass";

import GroupDetail from "./GroupDetail";

class Groups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      foundUserList: null,
      toggle_text: "create a new group >",
      createDisplay: "none",
      viewDisplay: "block",
      searchDisplay: "flex",
      success: false,
      user_results: [],
      searchText: "search for user >",
      selected_users: [props.auth.acronym],
      grp_name: "",
      grp_acronym: "",
      group_description: "",
      submitText: "create group",
      user_groups: [],
      fav_groups: [],
      group_query: "",
      query_results: [],
      toggle_detail: false,
      chosen_group: {}
    };
  }

  componentWillMount() {
    this.props.fetchUser();
    this.renderUserGroups();
    this.props.fetchGroups(this.props.auth.groups);
  }

  //1****************SEARCH FOR GROUPS*****************//
  /**
   * onQueryChange: listener for input change
   * searchGroups: POST req for groups with query params
   * renderSearchGroupList: JSX rendering group results
   **/
  onQueryChange = e => {
    this.setState(
      {
        group_query: e.target.value
      },
      () => {
        this.searchGroups();
      }
    );
  };

  searchGroups = async () => {
    const query = this.state.group_query;

    const search_groups = await axios.post("/api/search_groups", {
      query
    });

    if (search_groups.data) {
      this.setState({
        query_results: search_groups.data
      });
    }
  };

  renderSearchGroupList() {
    if (this.state.query_results.length < 1) {
      return (
        <div
          className="settings__groups-groupView"
          style={{ display: this.state.searchDisplay }}
        >
          <p className="group">No results.</p>
        </div>
      );
    }
    return this.state.query_results[0].map(group => {
      return (
        <div
          className="settings__groups-groupView"
          key={group}
          onClick={() => this.onGroupClick(group)}
          style={{ display: this.state.searchDisplay }}
        >
          <p>[{group.acronym}]</p>
          <p>{group.name}</p>
        </div>
      );
    });
  }
  //**************************************************1//

  //2****************DISPLAY USER GROUPS*****************//
  /**
   * renderUserGroups: POST req for user's group details
   * renderUserGroupList: JSX rendering user's groups
   * groupView: rendering according to whether they are favorited
   **/
  renderUserGroups = async () => {
    let groups = this.props.groups;
    let fav_group_acronyms = this.props.auth.favGroups;

    console.log("ASDF", groups);

    this.setState({
      user_groups: groups,
      fav_groups: fav_group_acronyms
    });
  };

  renderUserGroupList() {
    const user_fav_groups = this.props.auth.favGroups;

    console.log(this.state.user_groups.length);
    console.log(this.state.user_groups);
    console.log("fav", user_fav_groups);
    if (this.state.user_groups.length < 1) {
      return (
        <div className="settings__groups-groupView">
          <p className="group">You are not in any groups.</p>
        </div>
      );
    } else {
      return this.state.user_groups.map(group => {
        console.log(group);
        if (user_fav_groups.includes(group.acronym)) {
          return this.groupView("settings__groups-groupView isFavorite", group);
        } else {
          return this.groupView("settings__groups-groupView", group);
        }
      });
    }
  }

  groupView = (className, group) => {
    return (
      <div
        className={className}
        key={group.acronym}
        onClick={() => this.onGroupClick(group)}
      >
        <p>[{group.acronym}]</p>
        <p>{group.name}</p>
      </div>
    );
  };
  //**************************************************2//

  //3****************CREATE GROUP*****************//
  /**
   * on___change: listener for input change
   * resetBtn: reset button text after showing error message
   * findUser: POST req to find user to add to group
   * onSelect/Deselect: handles de/selection of users to add/remove from group
   ** subarray(for deselect): deletes user from selected user list
   * renderSearchList: JSX rendering results for user query
   * renderSelectedList: JSX rendering selected users
   * onSubmit: POST req to create group
   **/

  /**listeners**/
  onUserInfoChange = e => {
    this.setState(
      {
        user_info: e.target.value
      },
      () => {
        if (this.state.user_info !== "") {
          this.findUser();
        }
      }
    );
  };
  onNameChange = e => {
    this.setState({
      grp_name: e.target.value
    });
  };
  onAcronymChange = e => {
    this.setState({
      grp_acronym: e.target.value
    });
  };
  onDescriptionChange = e => {
    this.setState({
      grp_description: e.target.value
    });
  };
  /**end-listeners**/

  /**delayed button text resets**/
  resetBtnTxt = () => {
    setTimeout(() => {
      this.setState({
        searchText: "search for user >"
      });
    }, 2000);
  };

  resetSubmitBtn = e => {
    setTimeout(() => {
      this.setState(() => ({
        toggle_text: "create group"
      }));
    }, 4000);
  };
  /**end-delayed button text resets**/

  findUser = async () => {
    this.setState({
      user_results: []
    });
    // Grab state
    const { user_info } = this.state;

    const user = await axios.post("/api/find_user", {
      user_info
    });

    if (user.data.success) {
      this.setState({
        searchText: user.data.message,
        user_results: user.data.user,
        success: true
      });
    } else {
      this.setState({
        searchText: user.data.message
      });
    }
    this.resetBtnTxt();
  };

  onSelect = e => {
    let edited_user;
    let sl_users = this.state.selected_users;

    if (e.target.checked) {
      edited_user = sl_users.concat(e.target.value);
    } else if (!e.target.checked) {
      let index = sl_users.indexOf(e.target.value);
      if (index > -1) {
        edited_user = this.subarray(sl_users, index);
      }
    }
    this.setState({ selected_users: edited_user });
  };

  onDeselect = e => {
    let edited_user;
    let sl_users = this.state.selected_users;

    let index = sl_users.indexOf(e.target.value);
    if (index > -1) {
      edited_user = this.subarray(sl_users, index);
    }
    this.setState({ selected_users: edited_user });
  };

  subarray(array, index) {
    let temp_array = [];
    for (let i = 0; i < array.length; i++) {
      if (i !== index) {
        temp_array.push(array[i]);
      }
    }
    return temp_array;
  }

  renderSearchList() {
    return this.state.user_results.map(user => {
      return (
        <li key={user._id}>
          <input
            type="checkbox"
            id={user._id}
            value={user.acronym}
            className="foundUserCB"
            onChange={this.onSelect}
          />
          <label htmlFor={user._id}>
            [{user.acronym}] {user.firstName} {user.lastName}, {user.email}
          </label>
        </li>
      );
    });
  }

  renderSelectedList() {
    return this.state.selected_users.map(user => {
      return (
        <li key={user}>
          <input
            type="checkbox"
            id={user}
            value={user}
            className="foundUserCB"
            onClick={this.onDeselect}
          />
          <label htmlFor={user} className="selected">
            {user}
          </label>
        </li>
      );
    });
  }

  onSubmit = async () => {
    let { grp_name, grp_acronym, grp_description, selected_users } = this.state;

    if (!selected_users.includes(this.props.auth.acronym)) {
      selected_users.push(this.props.auth.acronym);
    }

    const memberCount = selected_users.length;

    const new_group = await axios.post("/api/create_group", {
      grp_name,
      grp_acronym,
      grp_description,
      memberCount,
      selected_users
    });

    if (new_group.data.success) {
      this.setState({
        submitText: new_group.data.message,
        success: true
      });
      setTimeout(() => {
        this.toggleView();
      }, 1000);
    } else {
      this.setState({
        submitText: new_group.data.message
      });
      this.resetSubmitBtn();
    }
    this.props.fetchUser();
    this.props.fetchGroups(this.props.auth.groups);
  };
  //**************************************************3//

  //4****************MISCELLANEOUS*****************//
  /**
   * toggleView: toggles between [create group] and [group list/search group] views
   * _handleKeyDown: pressing enter triggers submission of form
   * onGroupClick: clicking a group expands to more detailed view
   **/
  toggleView = () => {
    this.props.fetchUser();
    this.props.fetchGroups(this.props.auth.groups);
    this.renderUserGroups();
    console.log(this.props.groups);
    setTimeout(() => {
      if (this.state.toggle_text === "create a new group >") {
        this.setState({
          toggle_text: "view group list >",
          createDisplay: "block",
          viewDisplay: "none",
          searchDisplay: "none"
        });
      } else if (this.state.toggle_text === "view group list >") {
        this.renderUserGroups();
        this.setState({
          toggle_text: "create a new group >",
          createDisplay: "none",
          viewDisplay: "block",
          searchDisplay: "flex",
          toggle_detail: false
        });
      }
    }, 300);
  };

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      this.onSubmit();
    }
  };

  onGroupClick = group => {
    this.setState({
      toggle_detail: true,
      chosen_group: group,
      createDisplay: "none",
      viewDisplay: "none",
      searchDisplay: "none",
      toggle_text: "view group list >"
    });
  };
  //**************************************************4//

  render() {
    return (
      <div className="settings__groups">
        <p className="settings__groups-title">
          groups: includes, but is not limited to, churches, small groups,
          friends, and family.
        </p>
        {this.state.toggle_detail && (
          <GroupDetail group={this.state.chosen_group} />
        )}
        <div className="settings__groups-searchbar">
          <input
            type="text"
            className="settings__groups__form__field"
            placeholder="Seach for a group"
            value={this.state.group_query}
            style={{ display: this.state.searchDisplay }}
            onChange={this.onQueryChange}
          />
          {this.renderSearchGroupList()}
        </div>
        <div
          className="settings__groups-groupsin"
          style={{ display: this.state.viewDisplay }}
        >
          <p className="settings__groups-subtitle">groups you're in:</p>
          {this.renderUserGroupList()}
        </div>
        <button
          className="settings__groups-togglebtn"
          onClick={this.toggleView}
        >
          {this.state.toggle_text}
        </button>
        <div
          className="settings__groups-creategrp"
          style={{ display: this.state.createDisplay }}
        >
          <form className="settings__groups__form">
            <input
              type="text"
              className="settings__groups__form__field"
              placeholder="group name"
              value={this.state.grp_name}
              onChange={this.onNameChange}
              onKeyDown={this._handleKeyDown}
            />
          </form>
          <form className="settings__groups__form">
            <input
              type="text"
              className="settings__groups__form__field"
              placeholder="group acronym"
              maxLength="6"
              value={this.state.grp_acronym}
              onChange={this.onAcronymChange}
              onKeyDown={this._handleKeyDown}
            />
          </form>
          <form className="settings__groups__form">
            <textarea
              className="settings__groups__form__field description"
              placeholder="group description"
              value={this.state.grp_description}
              onChange={this.onDescriptionChange}
              onKeyDown={this._handleKeyDown}
            />
          </form>
          <form className="settings__groups__form">
            <input
              type="text"
              className="settings__groups__form__field"
              placeholder="find users (case sensitive)"
              value={this.state.user_info}
              onChange={this.onUserInfoChange}
              onKeyDown={this._handleKeyDown}
            />
          </form>

          {this.state.user_results.length > 0 && (
            <p className="settings__groups-header">search results:</p>
          )}
          <div className="settings__groups__foundUserDiv">
            <ul className="foundUserList">{this.renderSearchList()}</ul>
          </div>
          {this.state.selected_users.length > 0 && (
            <p className="settings__groups-header">selected users:</p>
          )}
          <div className="settings__groups__foundUserDiv">
            <ul className="foundUserList">{this.renderSelectedList()}</ul>
          </div>
        </div>
        <button
          className="settings__groups-createbtn"
          style={{ display: this.state.createDisplay }}
          onClick={this.onSubmit}
        >
          {this.state.submitText}
        </button>
      </div>
    );
  }
}

function mapStateToProps({ auth, groups }) {
  return { auth, groups };
}

export default connect(
  mapStateToProps,
  { fetchUser, fetchGroups }
)(Groups);

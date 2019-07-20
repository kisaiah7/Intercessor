import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import Sidebar from "../menu/Sidebar";
import Settings from "../settings/Settings";
import Notice from "./Notice";

import "../../sass/forMe.sass";

class PrayerForm extends Component {
  constructor() {
    super();

    this.state = {
      displayNotice: true,
      enterTransition: "prayerForm",
      title: "",
      body: "",
      recipients: "",
      success: false,
      btnText: "request prayer >",
      fav_groups: [],
      query: "",
      query_results: [],
      selected_results: [],
      selected: false,
      settings_popup: false
    };
  }

  componentWillMount() {
    this.setState({
      fav_groups: this.props.fav
    });
  }

  exitNotice = () => {
    this.setState({
      displayNotice: false,
      enterTransition: "prayerForm enterTransition"
    });
  };

  getDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    return today;
  }

  onChangeTitle = e => {
    this.setState({
      title: e.target.value
    });
  };

  onChangeBody = e => {
    this.setState({
      body: e.target.value
    });
  };

  onQueryChange = e => {
    this.setState(
      {
        query: e.target.value
      },
      () => {
        this.searchGroups();
      }
    );
  };

  resetSubmitBtn = () => {
    setTimeout(() => {
      this.setState({
        btnText: "request prayer >"
      });
    }, 4000);
  };

  onGroupClick = group => {
    let edited_results;
    let sl_results = this.state.selected_results;

    if (!this.state.selected_results.includes(group)) {
      if (group !== "none") {
        let index = sl_results.indexOf(this.state.favGroup_name);
        if (index > -1) {
          edited_results = this.subarray(sl_results, index);
        }
        edited_results = sl_results.concat(group);
      }
    } else if (this.state.selected_results.includes(group)) {
      let index = sl_results.indexOf(group);
      if (index > -1) {
        edited_results = this.subarray(sl_results, index);
      }
    }

    this.setState({ selected_results: edited_results });
  };

  groupDetails = async () => {
    const group_acronyms = this.props.auth.favGroups;

    const group_details = await axios.post("/api/listed_group_details", {
      group_acronyms
    });

    this.setState({
      fav_groups: group_details.data.groups
    });
  };

  searchGroups = async () => {
    const user_info = this.state.query;
    const query = this.state.query;
    let search_groups;
    let query_results = [];

    const search_users = await axios.post("/api/find_user", {
      user_info
    });

    if (search_users.data.user) {
      query_results = search_users.data.user;
    }

    this.setState({
      query_results: query_results
    });

    if (this.props.auth.groups.includes(query)) {
      search_groups = await axios.post("/api/search_groups", {
        query
      });
    }
    if (search_groups) {
      query_results = search_groups.data[0];
    }

    this.setState({
      query_results: query_results
    });

    if (search_users.data.user && search_groups) {
      query_results = search_users.data.user.concat(search_groups.data[0]);
    }

    this.setState({
      query_results: query_results
    });
  };

  renderGroupList() {
    if (this.state.fav_groups) {
      return this.state.fav_groups.map(group => {
        return (
          <div
            className="prayerForm__favGroups-group"
            id={group.acronym}
            key={group.acronym}
            onClick={() => this.onGroupClick(group.acronym)}
            style={this.state.favGroup_style}
          >
            <p>
              <i>
                [{group.acronym}]<br />
                {group.name}
              </i>
            </p>
          </div>
        );
      });
    }
  }

  onSelect = e => {
    let edited_results;
    let sl_results = this.state.selected_results;

    if (e.target.checked) {
      edited_results = sl_results.concat(e.target.value);
    } else if (!e.target.checked) {
      let index = sl_results.indexOf(e.target.value);
      if (index > -1) {
        edited_results = this.subarray(sl_results, index);
      }
    }

    this.setState({ selected_results: edited_results });
  };

  onDeselect = e => {
    let edited_results;
    let sl_results = this.state.selected_results;

    let index = sl_results.indexOf(e.target.value);
    if (index > -1) {
      edited_results = this.subarray(sl_results, index);
    }
    this.setState({ selected_results: edited_results });
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
    if (this.state.query_results.length < 1) {
      return (
        <div className="queryView">
          <p className="queryResult">No results.</p>
        </div>
      );
    }
    return this.state.query_results.map(query => {
      return (
        <li key={query._id}>
          <input
            type="checkbox"
            id={query.acronym}
            value={query.acronym}
            onChange={this.onSelect}
            selected={this.state.selected}
          />
          <label htmlFor={query.acronym}>
            [{query.acronym}] {query.name} {query.firstName} {query.lastName}{" "}
            {query.email}
          </label>
        </li>
      );
    });
  }

  renderSelectedList() {
    return this.state.selected_results.map(results => {
      return (
        <li key={results}>
          <input
            type="checkbox"
            id={results}
            value={results}
            className="foundUserCB"
            onClick={this.onDeselect}
          />
          <label htmlFor={results} className="selected">
            {results}
          </label>
        </li>
      );
    });
  }

  onRequestSubmit = async () => {
    this.setState({
      btnText: "requesting prayer..."
    });
    // Grab state
    const { title, body, selected_results } = this.state;

    if (title === "") {
      return this.setState({
        btnText: "Title is required."
      });
    } else if (body === "") {
      return this.setState({
        btnText: "Body is required."
      });
    } else if (selected_results.length < 1) {
      return this.setState({
        btnText: "Recipient is required."
      });
    } else {
      setTimeout(() => {
        this.setState({
          success: true
        });
      }, 1000);

      await axios.post("/api/new_prayer", {
        title: title,
        body: body,
        recipients: selected_results
      });
    }
  };

  popup = () => {
    this.setState({
      settings_popup: true
    });
  };

  exitPopup = () => {
    this.setState({
      settings_popup: false
    });
  };

  render() {
    const { body, title } = this.state;

    if (this.state.success) {
      return (
        <Redirect
          push
          to={{
            pathname: "/sanctuary",
            state: { body: body }
          }}
          replace
        />
      );
    }

    return (
      <div className={this.state.enterTransition}>
        <Sidebar onClick={this.toMenu} page="forMe" />
        {this.state.displayNotice && <Notice exit={this.exitNotice} />}
        {this.state.settings_popup ? (
          <Settings unmountMe={this.exitPopup} toGroups={true} />
        ) : null}
        <div className="prayerForm__favGroups">
          <p className="prayerForm__favGroups-header">favorite groups:</p>
          {this.state.fav_groups.length < 1 && (
            <p
              className="prayerForm__favGroups-header-favNotice"
              onClick={this.popup}
            >
              you have not favorited any groups!
            </p>
          )}
          {this.renderGroupList()}
        </div>
        <div className="prayerForm__form">
          <form className="prayerForm__form-right">
            <div className="prayerForm__form-top">
              <div className="prayerForm__form-top-date">{this.getDate()}</div>
              <input
                type="text"
                className="prayerForm__form-top-title form__field"
                placeholder="prayer title"
                value={title}
                onChange={this.onChangeTitle}
              />
            </div>
            <div className="prayerForm__form-bottom">
              <textarea
                type="text"
                className="prayerForm__form-bottom-body form__field"
                placeholder="detailed prayer request"
                value={body}
                onChange={this.onChangeBody}
              />

              <div className="prayerForm__form-bottom-recipients">
                <label>to: </label>
                <input
                  type="text"
                  className="prayerForm__form-bottom-recipients form__field"
                  placeholder="add people and groups"
                  value={this.state.query}
                  onChange={this.onQueryChange}
                />
                <ul className="foundQueryList">{this.renderSearchList()}</ul>
                {this.state.selected_results.length > 0 && (
                  <p className="foundQueryList__header">selected recipients:</p>
                )}
                <ul className="foundQueryList">{this.renderSelectedList()}</ul>
              </div>

              <div className="intercedeBtn" onClick={this.onRequestSubmit}>
                <p>{this.state.btnText}</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth, groups, fav }) {
  return { auth, groups, fav };
}

export default connect(
  mapStateToProps,
  {}
)(PrayerForm);

import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import "../../sass/others.sass";
import FilterGroups from "./FilterGroups";
import Notice from "./Notice";
import Sidebar from "../menu/Sidebar";
import Settings from "../settings/Settings";
import PrayerDetail from "./PrayerDetail";

import { fetchUser } from "../../actions";

class PrayerFeed extends Component {
  constructor() {
    super();

    this.state = {
      displayNotice: true,
      filter_toggle: false,
      fav_groups: [],
      group_acronym: "none",
      prayers: [],
      load_page: 0,
      load_btntext: "load more...",
      load_btnstyle: "load_more",
      group_name: "",
      settings_popup: false,
      detail_toggle: false,
      selected_dateSent: "",
      selected_title: "",
      selected_body: "",
      selected_user_name: "",
      selected_user_acronym: ""
    };
  }

  exitNotice = () => {
    this.setState({
      displayNotice: false
    });
  };

  //1************RENDER PRAYERS*************//
  /**
   * renderList: JSX rendering prayer requests
   * renderGroupList: JSX rendering favorite groups
   * groupDetails: POST req for favorite group details
   * filterToggle: render filter groups component
   * unmountMe: unmount filter groups component
   * filterChange: POST req for prayers by filter
   **/

  renderList() {
    return this.state.prayers.map(prayer => {
      return (
        <button
          className="prayerLink"
          key={prayer.id}
          onClick={() => this.viewDetailPrayer(prayer)}
        >
          <p>
            <span>
              [{prayer.user_acronym}] {prayer.user_name} >{" "}
              {prayer.dateSent.toString().substring(5, 10)}:
            </span>{" "}
            {prayer.title}
          </p>
        </button>
      );
    });
  }

  viewDetailPrayer = prayer => {
    this.setState({
      detail_toggle: true,
      selected_dateSent: prayer.dateSent,
      selected_title: prayer.title,
      selected_body: prayer.body,
      selected_user_name: prayer.user_name,
      selected_user_acronym: prayer.user_acronym,
      selected_user_gender: prayer.user_gender
    });
  };

  exitDetailPrayer = () => {
    this.setState({
      detail_toggle: false
    });
  };

  renderGroupList() {
    this.groupDetails();

    if (this.state.fav_groups) {
      return this.state.fav_groups.map(group => {
        return (
          <div
            className="groupContainer"
            id={group.acronym}
            key={group.acronym}
            onClick={() => this.onFavGroupClick(group.acronym)}
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

  groupDetails = async () => {
    const group_acronyms = this.props.auth.favGroups;

    const group_details = await axios.post("/api/listed_group_details", {
      group_acronyms
    });

    this.setState({
      fav_groups: group_details.data.groups
    });
  };

  filterToggle = () => {
    this.setState(prevState => {
      return { filter_toggle: !prevState.filter_toggle };
    });
  };

  unmountMe = () => {
    this.setState({
      filter_toggle: false
    });
  };

  filterChange = async group_acronym => {
    let { load_page } = this.state;
    let group_prayers;

    if (this.state.group_acronym === group_acronym) {
      load_page++;
      this.setState(prevState => {
        return {
          load_page: prevState.load_page + 1
        };
      });
    } else {
      load_page = 0;
      this.setState({
        load_page: 0
      });
    }

    group_prayers = await axios.post("/api/filter_prayers", {
      group_acronym,
      load_page
    });

    if (group_prayers.data.length < 10) {
      this.setState({
        load_btntext: "end of list",
        load_btnstyle: "load_more end"
      });
    } else {
      this.setState({
        load_btntext: "load more...",
        load_btnstyle: "load_more"
      });
    }

    /// TODO: GROUP NAME RETRIEVAL...
    if (load_page > 0) {
      this.setState(prevState => {
        return {
          prayers: prevState.prayers.concat(group_prayers.data),
          group_acronym: group_acronym,
          group_name: group_prayers.data.name
        };
      });
    } else {
      this.setState({
        prayers: group_prayers.data,
        group_acronym: group_acronym,
        group_name: group_prayers.data.name
      });
    }
  };

  loadMore = () => {
    this.filterChange(this.state.group_acronym);
  };

  onFavGroupClick = group => {
    if (this.state.group_acronym !== group) {
      this.setState({
        group_acronym: group
      });
      this.filterChange(group);
    } else if (this.state.group_acronym === group) {
      this.setState({
        group_acronym: "none"
      });
      this.filterChange("none");
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

  //2************LAYOUT*************//
  /**
   * SIDEBAR
   * toggle view NOTICE
   * toggle view PRAYER DETAIL
   * toggle view SETTINGS-GROUP when clicking SET FAV GROUPS
   * view: LEFT SIDE
   * view: RIGHT SIDE
   * filter button
   * toggle view FILTER component
   **/

  render() {
    return (
      <div className="prayerFeedContainer">
        <Sidebar onClick={this.toMenu} page="others" />
        {this.state.displayNotice && <Notice exit={this.exitNotice} />}
        {this.state.detail_toggle && (
          <PrayerDetail
            date={this.state.selected_dateSent}
            title={this.state.selected_title}
            body={this.state.selected_body}
            user_name={this.state.selected_user_name}
            user_acronym={this.state.selected_user_acronym}
            user_gender={this.state.selected_user_gender}
            exit={this.exitDetailPrayer}
          />
        )}
        {this.state.settings_popup ? (
          <Settings unmountMe={this.exitPopup} toGroups={true} />
        ) : null}
        <div className="left">
          <p className="favTitle">Favorite Groups:</p>
          {this.state.fav_groups.length < 1 && (
            <p className="favNotice" onClick={this.popup}>
              you have not favorited any groups!
            </p>
          )}
          {this.renderGroupList()}
        </div>
        <div className="right" id="scroll">
          {this.state.group_acronym === "none" && (
            <p className="filterNotice" onClick={this.filterToggle}>
              choose a filter
            </p>
          )}
          {this.state.group_acronym !== "none" && (
            <p className="groupName">{this.state.group_name}</p>
          )}
          {this.state.group_acronym !== "none" && this.renderList()}
        </div>
        {this.state.group_acronym !== "none" && (
          <button className={this.state.load_btnstyle} onClick={this.loadMore}>
            {this.state.load_btntext}
          </button>
        )}
        <div className="filter" onClick={this.filterToggle}>
          filter: {this.state.group_acronym}
        </div>
        {this.state.filter_toggle && (
          <FilterGroups
            unmountMe={this.unmountMe}
            filterChange={this.filterChange}
          />
        )}
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
)(PrayerFeed);

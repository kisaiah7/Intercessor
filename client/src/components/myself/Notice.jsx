import React, { Component } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../menu/Sidebar";

import "../../sass/notice.sass";

class Notice extends Component {
  render() {
    return (
      <div className="noticeContainer">
        <Sidebar onClick={this.toMenu} page="myself" />
        <div className="myselfNoticeContainer">
          <div className="top">
            <div className="left">
              <p>
                <i>Matthew 7:7</i>
              </p>
            </div>
            <div className="right">
              <p>
                <i>
                  Ask, and it will be given to you; seek, and you will find;
                  knock, and it will be opened to you.
                </i>
              </p>
            </div>
          </div>
          <div className="bottom">
            <Link className="link" to="/myself/sanctuary">
              {"enter >"}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Notice;

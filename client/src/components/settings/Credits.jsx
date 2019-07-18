import React, { Component } from "react";
import axios from "axios";

import "../../sass/settings/credits.sass";

class Credits extends Component {
  render() {
    return (
      <div className="settings__credits">
        <p className="settings__credits-title">Credits:</p>
        <p className="settings__credits-item">
          Icon made by Freepik from www.flaticon.com
        </p>
        <p className="settings__credits-item">©2019, Yangha Kim</p>
        <p className="settings__credits-item">version: 1.0.0</p>
      </div>
    );
  }
}

export default Credits;

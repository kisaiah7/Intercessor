import React, { Component } from "react";
import "../../sass/menu.sass";
import { Link } from "react-router-dom";

class Menu extends Component {
  render() {
    return (
      <div className="menuContainer">
        <div className="othersContainer">
          <p className="text">I want to intercede for others</p>
          <Link to={"/others"} className="link">
            {"prayers >"}
          </Link>
        </div>
        <div className="myselfContainer">
          <p className="text">I want to intercede for myself</p>
          <Link to={"/sanctuary"} className="link">
            {"sanctuary >"}
          </Link>
        </div>
        <div className="forMeContainer">
          <p className="text">I want others to intercede for me</p>
          <Link to={"/forMe"} className="link">
            {"request >"}
          </Link>
        </div>
      </div>
    );
  }
}

export default Menu;

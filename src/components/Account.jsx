import React from "react";
import styles from "./Account.css";

export default class Account extends React.Component {
  render() {
    let login = this.props.login;
    return (
      <a href={this.props.linkTo} className={styles.a}>
        <img src={this.props.avatar_url} alt={login} title={login} className={styles.avatar}/>
        <span className={styles.login}>{login}</span>
      </a>
    );
  }
}

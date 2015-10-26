import styles from "./Suggestion.css";

import React from "react";
import Account from "./Account.jsx";

export default class Suggestion extends React.Component {
  constructor(props) {
    super(props);

    // Again, we need to bind this component to the function since
    // we aren't using ES7 property initializers.
    this.handleIgnore = this.handleIgnore.bind(this);
  }
  handleIgnore() {
    this.props.store.refresh(this.props.data);
  }
  render() {
    let suggestion = this.props.data;
    return (
      <li className={styles.li}>
        <div className={styles.wrap}>
          <Account avatar_url={suggestion.avatar_url} login={suggestion.login} linkTo={suggestion.html_url}/>
          <button className={styles.button} onClick={this.handleIgnore}>X</button>
        </div>
      </li>
    );
  }
}

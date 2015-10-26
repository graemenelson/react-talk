import styles from "./Suggestions.css";

import React from "react";
import Suggestion from "./Suggestion.jsx";

export default class Suggestions extends React.Component {
  render() {
    // Need to build up the child components, and provide a `key`.
    // See: https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    let store       = this.props.store;
    let suggestions = this.props.store.active.map((suggestion) => {
      return <Suggestion data={suggestion} key={suggestion.id} store={store}/>;
    });
    return (
      <ul className={styles.ul}>
        {suggestions}
      </ul>
    );
  }
}

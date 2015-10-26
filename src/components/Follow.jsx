import styles from './Follow.css';
import loading from './assets/loading.gif';

import React from "react";
import {reactiveComponent} from 'mobservable-react';
import Suggestions from "./Suggestions.jsx";

// ES7 decorator responsible for providing mobservable
// functionality to the React Component.
@reactiveComponent
export default class Follow extends React.Component {
  constructor(props) {
    super(props);

    // Binds this component to the handleRefresh function.
    // If we didn't do this, then `this` would not reference
    // the component within the function.
    //
    // NOTE: you can use babel stage 0 to get ES7 property initializers,
    // see: https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es7-property-initializers
    this.handleRefresh = this.handleRefresh.bind(this);
  }
  handleRefresh() {
    this.props.store.refreshAll();
  }
  render() {
    this.isLoading = !this.props.store.hasSuggestions();
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>People To Follow</h1>
          {this.renderRefreshButton()}
        </header>
        <section className={styles.section}>
          {this.renderSectionContent()}
        </section>
      </div>
    );
  }
  renderRefreshButton() {
    return this.isLoading ? "" : <button className={styles.button} onClick={this.handleRefresh}>Refresh</button>;
  }
  renderSectionContent() {
    return this.isLoading ? this.renderLoading() : this.renderSuggestions();
  }
  renderSuggestions() {
    return <Suggestions store={this.props.store} />;
  }
  renderLoading() {
    return (
      <div className={styles.loading}>
        <img src={loading} />
      </div>
    );
  }
}

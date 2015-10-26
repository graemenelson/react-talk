import React from "react";
import Follow from "./components/Follow.jsx"
import SuggestionsStore from "./stores/SuggestionsStore";

let store = new SuggestionsStore();

React.render(<Follow store={store}/>, document.getElementById('follow'));

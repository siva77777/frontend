import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from "@shopify/polaris";
import Login from './views/Login';
import "@shopify/polaris/styles.css";

ReactDOM.render(<AppProvider><Login /></AppProvider>, document.getElementById("root"));
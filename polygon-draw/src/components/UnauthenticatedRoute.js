import React from "react";
import { BrowserRouter as Route, Redirect } from "react-router-dom";

export default function UnauthenticatedRoute({
  component: C,
  appProps,
  ...rest
}) {
  <Route
    {...rest}
    render={(props) =>
      !appProps.isAuthenticated ? (
        <C {...props} {...appProps} />
      ) : (
        <Redirect to="/" />
      )
    }
  />;
}

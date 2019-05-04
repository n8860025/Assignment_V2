import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import { Register } from "./register";
import { LoginArea } from "./login";
import { OffencesTable } from "./offences";
import { SearchOffences } from "./SearchOffences";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import "./css/index.css";
import Dashboard from "./dashboard";

function App() {
  const [token, setToken] = useState(null);
  const [cookies, setCookie] = useCookies(["email", "token"]);

  const assignToken = t => {
    if (t !== null) {
      setToken(t);
    }
  };

  const clearToken = () => {
    setToken(null);
  };

  useEffect(() => {
    cookies.token === "null" ? null : assignToken(cookies.token);
  }, []);

  useEffect(() => {
    setCookie("token", token, { path: "/" });
  }, [token, setCookie]);

  const setEmail = email => {
    setCookie("email", email, { path: "/" });
  };

  const Logout = () => {
    return (
      <button onClick={clearToken} className="button logout">
        Logout
      </button>
    );
  };

  const HeaderBanner = props => {
    const [clicked, setClicked] = useState(false);
    const clickHandler = () => {
      setClicked(true);
    };
    const GoHome = () => {
      setClicked(false);
      return <Redirect to="/" />;
    };
    return (
      <div className="HeaderBanner">
        <h1 onClick={clickHandler}>Offences Data</h1>
        {clicked ? <GoHome /> : null}
      </div>
    );
  };

  const Login = props => {
    const redirect = () => {
      props.history.push("/");
    };
    return (
      <LoginArea
        token={assignToken}
        email={setEmail}
        cookies={cookies}
        redirect={redirect}
      />
    );
  };

  const RegisterArea = () => {
    return <Register />;
  };

  const Main = props => {
    if (token !== null) {
      return <Redirect to="/dashboard" />;
    }
    const registerHandler = () => {
      props.history.push("/register");
    };

    const loginHandler = () => {
      props.history.push("/login");
    };

    return (
      <div>
        <button onClick={registerHandler}>Register</button>
        <button onClick={loginHandler}>Login</button>
      </div>
    );
  };

  const DashboardArea = props => {
    console.log("logged in, token: " + token);
    if (token === null) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Logout />
        <OffencesTable />
      </div>
    );
  };

  return (
    <CookiesProvider>
      <Router>
        <div className="App">
          <HeaderBanner />
          <main>
            <Route exact path="/" component={Main} />
            <Route path="/register" component={RegisterArea} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={DashboardArea} />
          </main>
        </div>
      </Router>
    </CookiesProvider>
  );

  /*
  return (
    <CookiesProvider>
      <Router>
        <div className="App">
          <HeaderBanner />
          <Register />
          <button onClick={registerHandler} class="button register">
            Register
          </button>
          <hr />
          {token === null ? (
            <LoginArea token={assignToken} email={setEmail} cookies={cookies} />
          ) : (
            <Logout />
          )}
          {token === null ? null : <SearchOffences token={token} />}
          <OffencesTable />
        </div>
      </Router>
    </CookiesProvider>
  );
  */
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

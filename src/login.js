import React from "react";
import { useState, useEffect } from "react";
import { useLogin } from "./api";
import "./css/login.css";
import { LoadingIcon } from "./loadingIcon";

export function LoginArea(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, loading, error } = useLogin(email, password);
  const [errorLogin, setErrorLogin] = useState(null);
  const [disable, setDisable] = useState(false);
  const [innerEmail, setInnerEmail] = useState(() => {
    console.log(props.cookies.email);
    return props.cookies.email === undefined ? "" : props.cookies.email;
  });

  useEffect(() => {
    props.token(token);

    if (token !== null) {
      setDisable(true);
      props.redirect();
    }
  }, [token]);

  function handleSubmit(e) {
    e.preventDefault();
    const email = innerEmail;
    const password = e.target.password.value;
    const remember_checked = e.target.remember.checked;

    if (!/[@]/.test(email)) {
      setErrorLogin("Please enter a valid email address");
    } else if (password === "") {
      setErrorLogin("Please enter a password");
    } else {
      if (remember_checked) {
        props.email(innerEmail);
      }
      setEmail(email);
      setPassword(password);
      setErrorLogin(null);
    }
  }

  if (token !== null) {
    return (
      <div className="login">
        <p className="logged_in">Logged in!</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login">
        <h2>Log In</h2>
        <input
          aria-labelledby="email"
          name="email"
          id="email"
          type="text"
          placeholder="Email address"
          disabled={disable}
          className="login__input"
          value={innerEmail}
          onChange={e => setInnerEmail(e.target.value)}
        />
        <input
          aria-labelledby="password"
          name="password"
          id="password"
          type="password"
          placeholder="Password"
          disabled={disable}
          className="login__input"
        />
        <section className="remember_me">
          <input
            type="checkbox"
            name="remember"
            id="remember"
            value="true"
            disabled={disable}
            className="remember_me__checkbox"
          />
          <label htmlFor="remember">Remember me</label>
        </section>{" "}
        <br />
        <button type="submit" disabled={disable} className="button submit">
          Log In
        </button>
      </form>
      {errorLogin !== null ? (
        <p className="error">
          <strong>Error: </strong>
          {errorLogin}
        </p>
      ) : null}
      {error !== null ? (
        <p className="error">
          <strong>Error: </strong>
          {error}
        </p>
      ) : null}
    </div>
  );
}

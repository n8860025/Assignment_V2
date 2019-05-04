import React, { useState } from "react";
import { useRegister } from "./api";
import "./css/register.css";

export function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitRequest, setSubmitRequest] = useState(false);
  const [error, setError] = useState(null);
  //const [loading, errorSubmit] = useRegister(submitRegister, email, password);

  function submitHandler(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!/[@]/.test(email)) {
      setError("Please enter a valid email address");
    } else if (password === "") {
      setError("Please enter a password");
    } else {
      setEmail(email);
      setPassword(password);
      setSubmitRequest(true);
      setError(null);
    }
  }
  return (
    <div className="register">
      <form onSubmit={submitHandler} className="form">
        <h2>Register</h2>
        <input
          name="email"
          id="email"
          placeholder="Email address"
          type="text"
          className="form__input"
        />
        <input
          name="password"
          id="password"
          placeholder="Password"
          type="password"
          className="form__input"
        />
        <button type="submit" className="button submit">
          Register
        </button>
      </form>
      {error !== null ? <p className="error">Error: {error}</p> : null}
    </div>
  );
}

function wrapper() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState(false);
  const [registerStatusMessage, setRegisterStatusMessage] = useState("");
  const [register, setRegister] = useState(false);
  const { loading, success, error } = useRegister(register, email, password);
  //const loading = false;

  const login = () => {
    setRegister(true);
    setRegisterStatusMessage("Attempting register");
  };

  useEffect(() => {
    if (success) {
      setRegisterStatusMessage("Login success");
      setRegisterStatus(true);
    } else if (success === false) {
      setRegisterStatusMessage("Something went wrong :( please try again");
      setRegister(false);
    }
  }, [success, register]);

  return (
    <div>
      <form>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="text"
          name="email"
          disabled={registerStatus}
          required
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          name="password"
          disabled={registerStatus}
          required
        />
      </form>
      <button onClick={login} disabled={registerStatus || loading}>
        Register Test
      </button>
      <p>{registerStatusMessage}</p>
    </div>
  );
}

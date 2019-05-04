import { useState, useEffect, useReducer } from "react";

export function useOffences() {
  const [offences, setOffences] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOffences()
      .then(offences => {
        setOffences(offences);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    offences,
    error: null
  };
}

function getOffences() {
  const url = "https://cab230.hackhouse.sh/offences";

  return fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response not ok");
    })
    .then(res => res.offences)
    .catch(e => {
      console.log(e.message);
    });
}

/*
export function useList(query) {
  const [list, setList] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getList(query)
      .then(res => {
        setList(res);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    list,
    error: null
  };
}
*/

function getList(query) {
  const url = "https://cab230.hackhouse.sh/" + query;

  return fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response not ok");
    })
    .then(res => {
      return res[query];
    })
    .catch(e => {
      console.log(e.message);
    });
}

export function useCategoryList() {
  //const categories = ["offences", "areas", "ages", "genders", "years"];
  const categories = ["offence", "area", "age", "gender", "year"];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialCondition = () => {
    let arr = [];
    categories.forEach(element => {
      arr.push({ title: element, list: null });
    });
    return arr;
  };
  function reducer(state, action) {
    switch (action.type) {
      case "add":
        state[action.index].list = action.list;
        return state;
      case "sort":
        // sort elements by order in "categories"
        let arr = [];
        categories.forEach((category, index) => {
          arr[index] = state.find(obj => {
            return obj.title === category;
          });
        });
        return arr;
      default:
        return state;
    }
  }
  const [categoryList, dispatch] = useReducer(reducer, initialCondition());

  useEffect(() => {
    categoryList.forEach((category, index) => {
      getList(category.title + "s")
        .then(list => {
          dispatch({ type: "add", list: list, index: index });
          // Check if all categories have finished loading
          if (
            categoryList.reduce((total, cat) => {
              return total && cat.list !== null;
            }, true)
          ) {
            setLoading(false);
          }
        })
        .catch(e => {
          console.log(e.message);
        });
    });
  }, []);

  return {
    categoryList,
    loading,
    error: null
  };
}

export function useLogin(user, password) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const body = "email=" + user.replace(/@/g, "%40") + "&password=" + password;

  useEffect(() => {
    if (user !== "" && password !== "") {
      setLoading(true);
      getLogin(body)
        .then(res => {
          setLoading(false);
          if (res.success) {
            setToken(res.token);
            setError(null);
          } else if (res.success === false) {
            setError("Something went wrong :(");
          } else {
            throw new Error("something went wrong");
          }
        })
        .catch(e => {
          setError(e.message);
          console.log(error);
        });
    }
  }, [user, password, body, error]);

  return {
    token,
    loading,
    error
  };
}

function getLogin(body) {
  const url = "https://cab230.hackhouse.sh/login";
  var result = { token: null, success: null };

  return fetch(url, {
    method: "POST",
    credentials: "same-origin",
    //body: "email=samuel.morgan%40connect.qut.edu.au&password=assignment",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(res => {
      result.token = res.token;
      result.success = true;
      return result;
    })
    .catch(e => {
      console.log("There has been an error", e.message);
      result.success = false;
      return result;
    });
}

export function useRegister(register, email, password) {
  // TODO - check what responses are supposed to be coming back from the API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const body = "email=" + email.replace(/@/g, "%40") + "&password=" + password;

  useEffect(() => {
    if (register) {
      setLoading(true);
      getRegister(body)
        .then(res => {
          setLoading(false);
          console.log(res);
        })
        .catch(e => {
          setError(e);
          console.log(e.message);
        });
    }
  }, [body, register]);

  return {
    loading,
    error
  };
}

function getRegister(body) {
  const url = "https://cab230.hackhouse.sh/register";

  return fetch(url, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok");
    })
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log("There has been an error", e.message);
    });
}

export function useOffenceSearch(token, search) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    console.log(search);
    if (search != null) {
      setLoading(true);
      searchOffences(token, search)
        .then(res => {
          setLoading(false);
          if (res !== null) {
            setSearchResult(res);
            setError(null);
          } else {
            throw new Error("something went wrong");
          }
        })
        .catch(e => {
          setError(e.message);
          console.log(error);
        });
    }
  }, [error, token, search]);

  return {
    searchResult,
    loading,
    error
  };
}

function searchOffences(token, search) {
  //The parameters of the call
  let getParam = { method: "GET" };
  let head = { Authorization: `Bearer ${token}` };
  getParam.headers = head;
  //The URL
  /*
  const baseUrl = "https://cab230.hackhouse.sh/search?";
  const query = "offence=" + search;
  const url = baseUrl + query;
  */

  const baseUrl = "https://cab230.hackhouse.sh/search?";
  const query = search.reduce((total, searchItem, index) => {
    if (index > 0) {
      return total + "&" + searchItem.query + "=" + searchItem.option;
    } else {
      return total + searchItem.query + "=" + searchItem.option;
    }
  }, "");
  //const query = "offence=" + search[0].option;
  const url = baseUrl + query;

  return fetch(encodeURI(url), getParam)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then(function(res) {
      return res.result;
    })
    .catch(function(error) {
      console.log(
        "There has been a problem with your fetch operation: ",
        error.message
      );
      return null;
    });
}

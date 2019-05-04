import React, { useEffect, useState, useReducer } from "react";
import { useCategoryList, useOffenceSearch } from "./api";
import { LoadingIcon } from "./loadingIcon";
import { checkPropTypes } from "prop-types";

export function SearchOffences(props) {
  // Constants
  const token = props.token;

  const { categoryList, loading, error } = useCategoryList();
  const [search, setSearch] = useState(null);
  //const [search, setSearch] = useState(null);
  const result = useOffenceSearch(props.token, search);

  const submitSearch = s => {
    setSearch(s);
  };

  if (loading) {
    return <LoadingIcon />;
  }

  /*
  <BuildTable arr={result.searchResult} />
  */

  return (
    <div>
      <BuildForm categoryList={categoryList} submitSearch={submitSearch} />
      {result.loading ? (
        <LoadingIcon />
      ) : (
        <BuildTable arr={result.searchResult} />
      )}
    </div>
  );
}

function BuildForm(props) {
  const [error, setError] = useState(null);
  const initialCondition = props.categoryList.map(category => {
    return { query: category.title, option: null };
  });
  const [search, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update":
        const i = state.findIndex(obj => {
          return obj.query === action.query;
        });
        state[i].option = action.option;
        return state;
      default:
        return state;
    }
  }, initialCondition);

  const submitHandler = e => {
    e.preventDefault();
    const i = search.findIndex(obj => {
      return obj.query === "offence";
    });
    if (i >= 0) {
      if (search[i].option === null || search[i].option === "null") {
        setError("Must list an offence");
      } else {
        setError(null);
        returnSearch();
      }
    }
  };

  const returnSearch = () => {
    const arr = search.filter(cat => {
      return cat.option !== null;
    });
    props.submitSearch(arr);
  };

  const onChangeHandler = e => {
    dispatch({ type: "update", query: e.target.name, option: e.target.value });
  };

  const onBuild = e => {
    dispatch({ type: "add", query: e.query, option: null });
  };

  return (
    <form onSubmit={submitHandler}>
      {props.categoryList.map((category, index) => (
        <BuildSelect
          title={category.title}
          list={category.list}
          index={index}
          onChangeHandler={onChangeHandler}
          onBuild={onBuild}
        />
      ))}
      <button type="submit">Search</button>
      {error !== null ? <p>{error}</p> : null}
    </form>
  );
}

function BuildSelect(props) {
  props.onBuild({ query: props.title });
  return (
    <select name={props.title} onChange={props.onChangeHandler}>
      <option value="null" key={props.index}>
        - {props.title.charAt(0).toUpperCase() + props.title.slice(1)} -
      </option>
      {props.list.map(item => (
        <option value={item}>{item}</option>
      ))}
    </select>
  );
}

function BuildTable(props) {
  if (props.arr === null) {
    return null;
  }
  return (
    <table border="1">
      <thead>
        <tr>
          <th>LGA</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>{props.arr.map(buildTableElement)}</tbody>
    </table>
  );
}

function buildTableElement(value) {
  return (
    <tr>
      <td>{value.LGA}</td>
      <td>{value.total}</td>
    </tr>
  );
}

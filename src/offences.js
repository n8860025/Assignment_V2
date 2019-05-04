import React, { useState, useEffect, useReducer } from "react";
import { useOffences } from "./api";
import "./css/offences.css";
import { LoadingIcon } from "./loadingIcon";

export function OffencesTable() {
  const { loading, offences, error } = useOffences();
  const [sortOffence, setSortOffences] = useState(useOffences());
  const [sortDirection, setSortDirection] = useState("des");
  const [innerText, setInnerText] = useState("");
  const [data, setData] = useState([]);

  const sort = () => {
    setData(data.slice().reverse());
  };

  useEffect(() => {
    if (offences !== "") {
      const categories = offences
        .slice()
        .sort()
        .reduce((result, element) => {
          const elementLowerCase = element.toLowerCase();
          const keyLowerCase = innerText.toLowerCase();
          if (elementLowerCase.includes(keyLowerCase)) {
            result.push(element);
          }
          return result;
        }, []);
      setData(categories);
    }
  }, [innerText, offences]);

  const TableBuilder = () => {
    return (
      <table border="1" className="offences-table">
        <thead>
          <tr>
            <th
              onClick={() => {
                sort();
              }}
              key="title"
            >
              Offence List
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((offence, index) => {
            return <OffencesTableElement title={offence} index={index} />;
          })}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    if (offences !== "") {
      setData(offences.slice().sort());
    }
  }, [offences]);

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <div className="container">
      <label>Search: </label>
      <input
        onChange={e => {
          setInnerText(e.target.value);
        }}
      />
      {data.length < 1 ? <p>No results</p> : <TableBuilder />}
    </div>
  );
}

function OffencesTableElement(props) {
  return (
    <tr>
      <td key={props.index}>{props.title}</td>
    </tr>
  );
}

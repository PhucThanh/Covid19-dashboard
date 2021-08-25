import numeral from "numeral";
import React from "react";
import { useState } from "react";
import "./Table.css";
function Table({ countries, handleCountryClick, filter }) {
  console.log(countries);
  countries = countries.filter((item) => {
    console.log(typeof item.country);
    return item.country.toLowerCase().includes(filter.toLowerCase());
  });
  return (
    <div className="table">
      <table>
        <tr>
          <th>Country</th>
          <th>Cases</th>
          <th className="td-green">Recovered</th>
          <th className="td-red">Deaths</th>
        </tr>
        {countries.map(({ country, cases, countryInfo, deaths, recovered }) => (
          <tr>
            <td
              className="td-country"
              onClick={(e) => handleCountryClick(countryInfo.iso2)}
            >
              <img src={countryInfo.flag} className="flag-icon" />
              {country}
            </td>
            <td>{numeral(cases).format("0,0")}</td>
            <td className="td-green">{numeral(recovered).format("0,0")}</td>
            <td className="td-red">{numeral(deaths).format("0,0")}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Table;

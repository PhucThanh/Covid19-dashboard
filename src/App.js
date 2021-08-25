import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import "./App.css";
import { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import LoadingOverlay from "react-loading-overlay";
import VaxGraph from "./VaxGraph";

function App() {
  const [countries, setCountries] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("worldwide");

  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.8, lng: -40.4 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data); //When start, fetch then set it for worldwide
      });
  }, []);

  //USEEFFECT = Runs based on given cond
  useEffect(() => {
    //Run once
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            flag: country.countryInfo.flag,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          countries.unshift({
            value: "worldwide",
            name: "World Wide",
            flag: "https://external-preview.redd.it/8dsUxBTzswMtngHQbQRsaJvf9IeAswO9sfUj8_c5Nv0.png?auto=webp&s=b44d8c0fd04a5fbe044dfe0af49fee7b4b34184c",
          });
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []); //Run when things inside this bracket changes

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setLoading(true);
    const url =
      countryCode == "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSelectedCountry(countryCode); //Just for the selector (a string)
        setCountryInfo(data); //Whole country data (JSON)

        if (data.countryInfo)
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

        setMapZoom(3);
      });
    setLoading(false);
  };
  const changeCountry = async (countryCode) => {
    setLoading(true);
    const url =
      countryCode == "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSelectedCountry(countryCode); //Just for the selector (a string)
        setCountryInfo(data); //Whole country data (JSON)
        if (data.countryInfo)
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
    setLoading(false);
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID19 TRACKER!</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.name}>
                  <div className="menuitem">
                    <img src={country.flag} className="flag-icon" />
                    {country.name}
                  </div>
                </MenuItem>
              ))}
              {/* <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide2">Worldwide2</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        <LoadingOverlay spinner active={false}>
          <div className="app__stats">
            <InfoBox
              isRed={true}
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="Cases"
              cases={countryInfo.todayCases}
              total={countryInfo.cases}
            />
            <InfoBox
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              cases={countryInfo.todayRecovered}
              total={countryInfo.recovered}
            />
            <InfoBox
              isRed={true}
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="Death"
              cases={countryInfo.todayDeaths}
              total={countryInfo.deaths}
            />
          </div>
        </LoadingOverlay>
        <LoadingOverlay active={loading} spinner>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            casesType={casesType}
          />
        </LoadingOverlay>
        {/*tables*/}
        {/*Graph*/}
        {/*Map*/}
      </div>
      <Card className="app__right">
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Live Cases by country</h3>
            <TextField
              style={{
                flex: 0.9,
                paddingRight: "20px",
              }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Table
            countries={tableData}
            handleCountryClick={changeCountry}
            filter={filter}
          />
          <h3 className="app__graphTitle">
            {" "}
            {countries.length > 0 &&
              countries.find((o) => o.value == selectedCountry)["name"]}{" "}
            {casesType}'s trend
          </h3>
          {/* <LineGraph className="app__graph" caseType={casesType} /> */}
          <VaxGraph casesType={casesType} selectedCountry={selectedCountry} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

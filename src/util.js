import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 200,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    multiplier: 200,
  },
  deaths: {
    hex: "#ab4443",
    multiplier: 1500,
  },
};

export const sortData = (data) => {
  const sortedData = data;
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const prettyPrintStat = (stat) => {
  return stat ? `${numeral(stat).format("0.0a")}` : "0";
};

//Draw circle on map
export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      pathOptions
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
      onMouseOver={() => {
        this.circle.leafletElement.bindPopup("foo").openPopup();
      }}
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirm">
            Cases:{numeral(country.cases).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths:{numeral(country.deaths).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered:{numeral(country.recovered).format("0,0")}
          </div>
          {casesTypeColors[casesType].hex}
        </div>
      </Popup>
    </Circle>
  ));

import React, { Component } from "react";
import popData from "./../assets/popData";

class MapInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marker: "United Kingdom",
    };
  }

  changeCountry = (marker) => {
    this.setState({
      marker: marker,
    });
  };

  render() {
    return (
      <div id="card">
        {this.props.countriesArray.map((country, i) => {
          if (country.country === this.state.marker) {
            if (country.us) {
              return (
                <div id="mapinfo" key={i}>
                  <div id="infoCountryName">
                    <img
                      id="flag"
                      src={`https://www.countryflags.io/us/flat/64.png`}
                    />
                    <h4>{country.country}</h4>
                  </div>
                  <br></br>
                  <div id="info-boxes">
                  <div id="infoUSCases">
                    <strong>Total Cases</strong>
                    <br></br> {country.confirmed}
                  </div>
                  <div id="infoUSDeaths">
                    <strong>Total Deaths</strong>
                    <br></br> {country.deaths}
                  </div>
                  {country.cfr <= this.props.globalCFR ? (
                    <div id="infoUSYellow">
                      <strong>C.F.R</strong>
                      <br></br> {country.cfr}%
                    </div>
                  ) : (
                    <div id="infoUSOrange">
                      <strong>C.F.R</strong>
                      <br></br> {country.cfr}%
                    </div>
                  )}
                  </div>
                </div>
              );
            } else {
              return (
                // {let popCountry = popData.popData.filter(pop => pop.name == country.country)}
                <div id="mapinfo" key={i}>
                  {/* <div id="info"> */}

                  {/* </div> */}
                  <div id="infoCountryName">
                    <img
                      id="flag"
                      src={`https://www.countryflags.io/${
                        popData.popData.filter(
                          (pop) => pop.name === country.country
                        )[0].cca2
                      }/flat/64.png`}
                    />
                    <h4>{country.country}</h4>
                  </div>
                  <br></br>
                  <div id="info-boxes">
                    <div id="infoCases">
                      <strong>Total Cases</strong>
                      <br></br>
                      {country.confirmed}
                    </div>
                    <div id="infoDeaths">
                      <strong>Total Deaths</strong>
                      <br></br> {country.deaths}
                    </div>
                    <div id="infoRecoveries">
                      <strong>Total Recoveries</strong>
                      <br></br> {country.recovered}
                    </div>
                    <div id="info">
                      <strong>Active Cases</strong>
                      <br></br> {country.activeCases}
                    </div>
                    <div id="info">
                      <strong>Critical Cases</strong>
                      <br></br> {country.criticalCases}
                    </div>
                    <div id="info">
                      <strong>New Deaths</strong>
                      <br></br> {country.newDeaths}
                    </div>
                    <div id="info">
                      <strong>Cases per Millon</strong>
                      <br></br> {country.perOneMillion}
                    </div>
                    {country.cfr <= this.props.globalCFR ? (
                      <div id="infoYellow">
                        <strong>C.F.R</strong>
                        <br></br> {country.cfr}%
                      </div>
                    ) : (
                      <div id="infoOrange">
                        <strong>C.F.R</strong>
                        <br></br> {country.cfr}%
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          }
        })}
      </div>
    );
  }
}

export default MapInfo;

import React, { Component } from "react";
import { Line, Doughnut, Bar, defaults } from "react-chartjs-2";
import CountryLineData from './country_data_line/country_data_line'
import GlobalCasesDoughnut from './global_cases_doughnut/global_cases_doughnut'
import DailyChangesBar from './daily_changes_bar/daily_changes_bar'

class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      // cases: true,
    };
  }

  componentDidMount() {
    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then((response) => response.json())
      .then((data) => {
        data["USA"] = data["US"];
        this.setState({
          data: data,
        });
      });
  }

  createLineLabels = () => {
    const labelData = [];
    const countryData = this.state.data[this.props.country];
    if (countryData !== undefined) {
      countryData.forEach((date) => {
        if (date.deaths !== 0) {
          labelData.push(date.date);
        }
      });
      return labelData;
    }
  };

  createLineData = (type) => {
    const graphData = {
      deaths: [],
      confirmed: [],
      recoveries: [],
    };

    const countryData = this.state.data[this.props.country];

    if (countryData !== undefined) {
      countryData.forEach((date) => {
        if (date.deaths !== 0) {
          graphData.confirmed.push(date.confirmed);
          graphData.deaths.push(date.deaths);
          graphData.recoveries.push(date.recovered);
        }
      });

      if (type === "confirmed") {
        return graphData.confirmed;
      } else if (type === "deaths") {
        return graphData.deaths;
      } else if (type === "recovered") {
        return graphData.recoveries;
      }
    }
  };

  // doughnutLabels = () => {
  //   const doughtnutLabels = [];
  //   if (this.props.countries !== undefined) {
  //     this.props.countries.forEach((country) => {
  //       if (country.country === this.props.country) {
  //         doughtnutLabels.unshift(country.country);
  //       }
  //       if (country.country !== this.props.country) {
  //         doughtnutLabels.push(country.country);
  //       }
  //     });
  //   }
  //   return doughtnutLabels;
  // };

  // doughnutData = () => {
  //   const doughnutData = [];
  //   if (this.props.countries !== undefined) {
  //     this.props.countries.forEach((country) => {
  //       if (country.country === this.props.country && !country.us) {
  //         doughnutData.unshift(
  //           ((country.confirmed / this.props.total[0]) * 100).toFixed(2)
  //         );
  //       }
  //       if (!country.us && country.country !== this.props.country) {
  //         doughnutData.push(
  //           ((country.confirmed / this.props.total[0]) * 100).toFixed(2)
  //         );
  //       }
  //     });
  //   }
  //   return doughnutData;
  // };

  // barData = () => {
  //   const daily = [];
  //   const dailyChange = [];

  //   const countryData = this.state.data[this.props.country];
  //   if (countryData !== undefined) {
  //     countryData.forEach((country) => {
  //       if (country.deaths !== 0) {
  //         daily.push(country.confirmed);
  //       }
  //     });

  //     for (let i = 0; i < daily.length; i++) {
  //       dailyChange.push(parseFloat(daily[i + 1]) - parseFloat(daily[i]));
  //     }

  //     dailyChange.pop();
  //     return dailyChange;
  //   }
  // };

  barLabel = () => {
    const daily = [];

    const countryData = this.state.data[this.props.country];
    if (countryData !== undefined) {
      countryData.forEach((country) => {
        if (country.deaths !== 0) {
          daily.push(country.date);
        }
      });

      daily.reverse();
      daily.pop();
      daily.reverse();
      return daily;
    }
  };

  // barDataDeaths = () => {
  //   const daily = [];
  //   const dailyChange = [];

  //   const countryData = this.state.data[this.props.country];
  //   if (countryData !== undefined) {
  //     countryData.forEach((country) => {
  //       if (country.deaths !== 0) {
  //         daily.push(country.deaths);
  //       }
  //     });

  //     for (let i = 0; i < daily.length; i++) {
  //       dailyChange.push(parseFloat(daily[i + 1]) - parseFloat(daily[i]));
  //     }

  //     dailyChange.pop();
  //     return dailyChange;
  //   }
  // };

  growthFactorData = () => {
    let growthFactorData = [];
    let dailyR = [];
    let finalArray = [];

    const countryData = this.state.data[this.props.country];
    if (countryData !== undefined) {
      let dailyChange = this.barData();

      for (let i = 1; i < dailyChange.length; i++) {
        let a = dailyChange[i + 1] / dailyChange[i];
        if (a === Infinity) {
          dailyR.push(0.0001);
        } else if (a > 15) {
          dailyR.push(0.0001);
        } else {
          a = a ? dailyR.push(a) : dailyR.push(0.001);
        }
      }
      finalArray = this.movingAverage(dailyR, 7);
    }

    return finalArray;
  };

  newGrowthFactorData = (window) => {
    let daily = [];
    let dailyChange = [];
    let dailyR = [];

    const countryData = this.state.data[this.props.country];

    if (countryData !== undefined) {
      let ma7 = this.movingAverage(this.createLineData("confirmed"), window);

      ma7.forEach((country) => {
        daily.push(country);
      });
      for (let i = 0; i < daily.length; i++) {
        dailyChange.push(parseFloat(daily[i + 1]) - parseFloat(daily[i]));
      }

      dailyChange.pop();

      for (let i = 1; i < dailyChange.length; i++) {
        let a = dailyChange[i + 1] / dailyChange[i];
        if (a === Infinity) {
          dailyR.push(0.0001);
        } else {
          a = a ? dailyR.push(a) : dailyR.push(0.001);
        }
      }
      dailyR.pop();
      return dailyR;
    }
  };

  movingAverage = (dailyR, window) => {
    let movingAverageValues = [];
    let temp_array = [];
    let reversed = dailyR.reverse();
    for (let i = 0; i < reversed.length; i++) {
      temp_array.push(dailyR[i]);
      if (temp_array.length === window) {
        movingAverageValues.push(
          temp_array.reduce((total, num) => {
            return total + num;
          }) / window
        );
        temp_array = [];
        i -= window - 1;
      }
    }

    movingAverageValues = movingAverageValues.reverse();
    return movingAverageValues;
  };

  growthFactorLabels = () => {
    let labels = this.createLineLabels();
    const countryData = this.state.data[this.props.country];
    if (countryData !== undefined) {
      labels.pop();
      labels.pop();
      let reversed = labels.reverse();
      for (let i = 0; i < 7; i++) {
        reversed.pop();
      }
      return reversed.reverse();
    }
  };

  growthFactorOne = (array) => {
    let oneArray = [];
    const countryData = this.state.data[this.props.country];

    if (countryData !== undefined) {
      for (let i = 0; i < array.length; i++) {
        oneArray.push(1);
      }
      return oneArray;
    }
  };

  // handleClick = () => {
  //   this.setState({
  //     cases: !this.state.cases,
  //   });
  // };
  render() {
    defaults.global.defaultFontColor = "white";

    // const line = {
    //   labels: this.createLineLabels(),
    //   datasets: [
    //     {
    //       label: "Confirmed Cases",
    //       data: this.createLineData("confirmed"),
    //       fill: false,
    //       backgroundColor: "#18A2B8",
    //       borderColor: "#18A2B8",
    //       borderWidth: 2,
    //       pointBackgroundColor: "#18A2B8",
    //       pointBorderColor: "#000000",
    //       pointBorderWidth: 0.5,
    //       pointStyle: "rectRounded",
    //       pointRadius: 4,
    //       pointHitRadius: 5,
    //       pointHoverRadius: 5,
    //       hoverBackgroundColor: "#FFFFFF",
    //     },
    //     {
    //       label: "Confirmed Deaths",
    //       data: this.createLineData("deaths"),
    //       fill: false,
    //       backgroundColor: "#dc3644",
    //       borderColor: "#dc3644",
    //       borderWidth: 2,
    //       pointBackgroundColor: "#dc3644",
    //       pointBorderColor: "#000000",
    //       pointBorderWidth: 0.5,
    //       pointStyle: "rectRounded",
    //       pointRadius: 4,
    //       pointHitRadius: 5,
    //       pointHoverRadius: 5,
    //       hoverBackgroundColor: "#FFFFFF",
    //     },
    //     {
    //       label: "Confrmed Recoveries",
    //       data: this.createLineData("recovered"),
    //       fill: false,
    //       backgroundColor: "#28a745",
    //       borderColor: "#28a745",
    //       borderWidth: 2,
    //       pointBackgroundColor: "#28a745",
    //       pointBorderColor: "#000000",
    //       pointBorderWidth: 0.5,
    //       pointStyle: "rectRounded",
    //       pointRadius: 4,
    //       pointHitRadius: 5,
    //       pointHoverRadius: 5,
    //       hoverBackgroundColor: "#FFFFFF",
    //     },
    //   ],
    // };

    // const lOptions = {
    //   scales: {
    //     xAxes: [
    //       {
    //         ticks: {
    //           display: true,
    //           major: {
    //             fontStyle: "bold",
    //             fontColor: "#FFFFFF",
    //           },
    //         },
    //         gridLines: {
    //           display: false,
    //           drawBorder: true,
    //         },
    //         scaleLabel: {
    //           display: true,
    //           labelString: "Date (YYYY/MM/DD)",
    //           fontStyle: "bold",
    //           fontColor: "#FFFFFF",
    //         },
    //       },
    //     ],
    //     yAxes: [
    //       {
    //         ticks: {
    //           display: true,
    //           major: {
    //             fontStyle: "bold",
    //             fontColor: "#FFFFFF",
    //           },
    //         },
    //         gridLines: {
    //           display: true,
    //           drawBorder: true,
    //         },
    //         scaleLabel: {
    //           display: true,
    //           labelString: "No of People",
    //           fontStyle: "bold",
    //           fontColor: "#FFFFFF",
    //         },
    //       },
    //     ],
    //   },
    //   legend: {
    //     display: true,
    //     position: "right",
    //     align: "center",
    //     labels: {
    //       fontSize: 12,
    //       fontStyle: "bold",
    //       fontColor: "#FFFFFF",
    //       usePointStyle: true,
    //     },
    //   },
    //   lineTension: 3,
    //   borderWidth: 2,
    // };

    // const doughnut = {
    //   labels: this.doughnutLabels(),
    //   datasets: [
    //     {
    //       data: this.doughnutData(),
    //       backgroundColor: ["#FBBD08"],
    //       hoverBackgroundColor: "#18A2B8",
    //       borderWidth: 0.5,
    //       borderColor: "#646D79",
    //     },
    //   ],
    // };

    // const dOptions = {
    //   legend: false,
    //   animation: {
    //     animateScale: true,
    //   },
    //   cutoutPercentage: 50,
    //   circumfrance: 0.141596,
    //   title: {
    //     display: true,
    //   },
    //   tooltips: {
    //     backgroundColor: "#18A2B8",
    //     displayColors: false,
    //     callbacks: {
    //       label: function (tooltipItems, data) {
    //         if (data !== undefined) {
    //           let dataPercentage =
    //             data.datasets[tooltipItems.datasetIndex].data[
    //               tooltipItems.index
    //             ];
    //           return (
    //             data.labels[tooltipItems.index] + " " + dataPercentage + "%"
    //           );
    //         }
    //       },
    //     },
    //   },
    // };

    // const bar = {
    //   labels: this.barLabel(),
    //   datasets: [
    //     {
    //       label: "Daily Case Increase",
    //       data: this.barData(),
    //       backgroundColor: "rgba(24,162,184, 0.2)",
    //       borderColor: "#18a2b8",
    //       borderWidth: 1,
    //       hoverBackgroundColor: "#18a2b8",
    //       hoverBorderColor: "rgba(255,99,132,0.2)",
    //       pointColor: "#18a2b8",
    //     },
    //   ],
    // };

    // const barDeaths = {
    //   labels: this.barLabel(),
    //   datasets: [
    //     {
    //       label: "Daily Death Increase",
    //       data: this.barDataDeaths(),
    //       backgroundColor: "rgba(255,99,132,0.2)",
    //       borderColor: "#dc3644",
    //       borderWidth: 1,
    //       hoverBackgroundColor: "#dc3644",
    //       hoverBorderColor: "rgba(255,99,132,0.2)",
    //       pointColor: "#dc3644",
    //     },
    //   ],
    // };

    // const bOptions = {
    //   scales: {
    //     xAxes: [
    //       {
    //         ticks: {
    //           display: true,
    //           major: {
    //             fontStyle: "bold",
    //             fontColor: "#FFFFFF",
    //           },
    //         },
    //         gridLines: {
    //           display: false,
    //           drawBorder: true,
    //         },
    //         scaleLabel: {
    //           display: true,
    //           labelString: "Cases",
    //           fontStyle: "bold",
    //           fontColor: "#FFFFFF",
    //         },
    //       },
    //     ],
    //     yAxes: [
    //       {
    //         ticks: {
    //           beginAtZero: true,
    //           display: true,
    //           major: {
    //             fontStyle: "bold",
    //             fontColor: "#FFFFFF",
    //           },
    //         },
    //         gridLines: {
    //           display: true,
    //           drawBorder: true,
    //         },
    //         scaleLabel: {
    //           display: true,
    //           labelString: "Deaths",
    //           fontStyle: "bold",
    //           fontColor: "#FFFFFF",
    //         },
    //       },
    //     ],
    //   },
    //   legend: {
    //     display: true,
    //     position: "right",
    //     align: "center",
    //     labels: {
    //       fontSize: 12,
    //       fontStyle: "bold",
    //       fontColor: "#FFFFFF",
    //     },
    //   },
    //   tooltips: {
    //     displayColors: false,
    //   },
    //   borderWidth: 2,
    //   maintainAspectRatio: true,
    // };

    // const bDeathOptions = {
    //   scales: {
    //     xAxes: [
    //       {
    //         ticks: {
    //           display: true,
    //           major: {
    //             fontStyle: "bold",
    //             fontColor: "#FFFFFF",
    //           },
    //         },
    //         gridLines: {
    //           display: false,
    //           drawBorder: true,
    //         },
    //         scaleLabel: {
    //           display: true,
    //           labelString: "Date (YY/MM/DD)",
    //           fontStyle: "bold",
    //           fontColor: "#FFFFFF",
    //         },
    //       },
    //     ],
    //     yAxes: [
    //       {
    //         ticks: {
    //           beginAtZero: true,
    //           display: true,
    //           major: {
    //             fontStyle: "bold",
    //             fontColor: "#FFFFFF",
    //           },
    //         },
    //         gridLines: {
    //           display: true,
    //           drawBorder: true,
    //         },
    //         scaleLabel: {
    //           display: true,
    //           labelString: "Cases",
    //           fontStyle: "bold",
    //           fontColor: "#FFFFFF",
    //         },
    //       },
    //     ],
    //   },
    //   legend: {
    //     display: true,
    //     position: "right",
    //     align: "center",
    //     labels: {
    //       fontSize: 12,
    //       fontStyle: "bold",
    //       fontColor: "#FFFFFF",
    //     },
    //   },
    //   tooltips: {
    //     displayColors: false,
    //   },
    //   borderWidth: 2,
    //   maintainAspectRatio: true,
    // };

    const gfLine = {
      labels: this.growthFactorLabels(),
      datasets: [
        {
          label: "Growth Factor",
          data: this.newGrowthFactorData(7),
          fill: false,
          backgroundColor: "#fbbd08",
          borderColor: "#fbbd08",
          borderWidth: 2,
          pointBackgroundColor: "#fbbd08",
          pointBorderColor: "#000000",
          pointBorderWidth: 0.5,
          pointStyle: "rectRounded",
          pointRadius: 4,
          pointHitRadius: 5,
          pointHoverRadius: 5,
          hoverBackgroundColor: "#FFFFFF",
        },
        {
          label: "Desired Growth Factor",
          data: this.growthFactorOne(this.growthFactorLabels()),
          fill: true,
          backgroundColor: "rgba(40, 167, 69, 0.4)",
          borderColor: "#28a745",
          borderWidth: 2,
          pointBorderWidth: 0,
          pointStyle: "rectRounded",
          pointRadius: 0,
          pointHitRadius: 0,
          pointHoverRadius: 0,
          pointBackgroundColor: "rgba(40, 167, 69, 0.4)",
          hoverBackgroundColor: "#28a745",
        },
      ],
    };

    const gfOptions = {
      scales: {
        xAxes: [
          {
            ticks: {
              display: true,
              major: {
                fontStyle: "bold",
                fontColor: "#FFFFFF",
              },
            },
            gridLines: {
              display: false,
              drawBorder: true,
            },
            scaleLabel: {
              display: true,
              labelString: "Date (YYYY/MM/DD)",
              fontStyle: "bold",
              fontColor: "#FFFFFF",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              display: true,
              major: {
                fontStyle: "bold",
                fontColor: "#FFFFFF",
              },
            },
            gridLines: {
              display: true,
              drawBorder: true,
            },
            scaleLabel: {
              display: true,
              labelString: "Growth Factor (R)",
              fontStyle: "bold",
              fontColor: "#FFFFFF",
            },
          },
        ],
      },
      legend: {
        display: true,
        position: "right",
        align: "center",
        labels: {
          fontSize: 12,
          fontStyle: "bold",
          fontColor: "#FFFFFF",
          usePointStyle: true,
        },
      },
      tooltips: {
        displayColors: false,
        callbacks: {
          label: function (tooltipItems, data) {
            return "R Value: " + tooltipItems.yLabel.toFixed(3);
          },
        },
      },
      lineTension: 3,
      borderWidth: 2,
      maintainAspectRatio: true,
    };

    return (
      <React.Fragment>
        <br></br>
        <br></br>
        <div id="l">
          <CountryLineData country={this.props.country} data={this.state.data} />
        </div>
        {/* <div id="l">
          <h4>{`${this.props.country}`} Data From Day of First Death</h4>
          <Line data={line} options={lOptions} />
        </div> */}
        <br></br>
        <br></br>
        <div id="b">
          <DailyChangesBar data={this.state.data} country={this.props.country}/>
          {/* <h4>{`${this.props.country}`} Daily Changes</h4>
          <br></br>
          {!this.state.cases && (
            <Button onClick={this.handleClick} variant={"info"}>
              Show Changes in Cases
            </Button>
          )}
          {this.state.cases && (
            <Button onClick={this.handleClick} variant={"danger"}>
              Show Changes in Deaths
            </Button>
          )}
          {!this.state.cases && <Bar data={barDeaths} options={bOptions} />}
          {this.state.cases && <Bar data={bar} options={bDeathOptions} />} */}
        </div>
        <div id="gf">
          <h4>{`${this.props.country}`} Growth Factor (R) </h4>
          <Line data={gfLine} options={gfOptions} />
        </div>
        <div id="d">
          <GlobalCasesDoughnut country={this.props.country} countries={this.props.countries} total={this.props.total}/>
          {/* <h4>{`${this.props.country}`} as % of Global Cases</h4>
          <Doughnut data={doughnut} options={dOptions} /> */}
        </div>
      </React.Fragment>
    );
  }
}

export default GraphContainer;

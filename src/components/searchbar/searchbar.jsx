import React, { Component } from "react";
import GraphContainer from "./../graph/graph";

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "United Kingdom",
      results: []
    };
  }

  getInfo = () => {
    let len = this.state.query.length;
    let results = [];
    this.props.countries.filter((country, i) => {
      if (
        country.country.substring(0, len).toLowerCase() ===
        this.state.query.toLowerCase()
      ) {
        results.push(country.country);
      }
    });
    this.setState({
      results: results,
    });
  };

  handleChange = () => {
    this.setState(
      {
        query: this.search.value,
      },
      () => {
        if (this.state.query && this.state.query.length >= 0) {
          this.getInfo();
        }
      }
    );
  };

  render() {
    return (
      <div>
        <h4 id="search-heading">Select a Country</h4>
        <div id="search-bar">
          <form onSubmit={this.handleSubmit} id="search-form">
            <label>
              <input 
              type="text" 
              name="search" 
              placeholder="Search.."
              ref={(input) => (this.search = input)
              }
              onChange={this.handleChange}
              />

            </label>
          </form>
          {/* {this.state.results.map((el) => {
            return <ul>{el}</ul>;
          })} */}
        </div>
        <div id="graph-countainer">
        {console.log(this.state.results)}
        <GraphContainer
          country={this.state.query}
          countries={this.props.countries}
          total={this.props.totalInt}
        />
        </div>
      </div>
    );
  }
}

export default SearchContainer;
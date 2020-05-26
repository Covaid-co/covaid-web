import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: props.neighborhoods };
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  // When the user selects an autocomplete suggestion...
  handleSelect = (address) => {
    // Pull in the setFormLocation function from the parent ReportForm
    const setFormLocation = this.props.setFormLocation;

    geocodeByAddress(address)
      .then(function (results) {
        // Set the location in the parent ReportFrom
        setFormLocation(results[0].formatted_address);
      })
      .catch((error) => console.error("Error", error));
  };

  render() {
    const renderInput = ({
      getInputProps,
      getSuggestionItemProps,
      suggestions,
    }) => (
      <div className="autocomplete-root">
        <input className="form-control" {...getInputProps()} />
        <div className="autocomplete-dropdown-container">
          {suggestions.map((suggestion) => (
            <div {...getSuggestionItemProps(suggestion)} className="suggestion">
              <span>{suggestion.description}</span>
            </div>
          ))}
        </div>
      </div>
    );

    // Limit the suggestions to show only cities in the US
    const searchOptions = {
      types: ["(cities)"],
      componentRestrictions: { country: "us" },
    };

    return (
      <>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          // Pass the search options prop
          searchOptions={searchOptions}
        >
          {renderInput}
        </PlacesAutocomplete>
      </>
    );
  }
}

export default LocationSearchInput;

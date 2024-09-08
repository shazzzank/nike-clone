import { useState, useEffect } from "react";
import { Country } from "country-state-city";
import Select from "./select";

function SelectCountry(props) {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  return (
    <Select
      name={props.name}
      value={props.value}
      onChange={(e) => {
        props.onChange(e);
        props.setCountry(e.target.value);
      }}
      placeholder={props.placeholder}
      options={countries.map((option) => ({
        ...option,
        name: option.name,
        value: option.isoCode,
      }))}
    />
  );
}

export default SelectCountry;

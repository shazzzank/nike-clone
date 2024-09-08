import { useState, useEffect } from "react";
import { State } from "country-state-city";
import Select from "./select";

function SelectState(props) {
  const [states, setStates] = useState([]);

  useEffect(() => {
    props.country
      ? setStates(State.getStatesOfCountry(props.country))
      : setStates([]);
  }, [props.country]);

  return (
    <Select
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      options={states.map((option) => ({
        ...option,
        name: option.name,
        value: option.isoCode,
      }))}
    />
  );
}

export default SelectState;

function Input(props) {
  return (
    <input
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      className="block w-full border border-gray-300 rounded-md p-4 mt-4 hover:border-gray-700"
      placeholder={props.placeholder}
    />
  );
}

export default Input;

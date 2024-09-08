import React, { useState } from "react";
import Tick from "../icons/tick";

const Radio = ({ label, value, selectedValue, handleChange }) => (
  <div className="block">
    <input
      type="radio"
      className="w-4 h-4 my-1.5"
      value={value}
      checked={selectedValue === value}
      onChange={() => handleChange(value)}
    />
    <span className="text-sm ml-2">{label}</span>
  </div>
);

const ColorOption = ({ color, selectedValue, handleClick }) => (
  <div
    className={`inline-block w-5/12 text-center mt-5 mr-2 hover:brightness-125 hover:cursor-pointer`}
    onClick={() => handleClick(color)}
  >
    {selectedValue === color ? (
      <Tick className="m-auto bg-green-600 text-white rounded-xl" />
    ) : (
      <span className={`w-5 h-5 bg-${color}-400 rounded-xl block m-auto`} />
    )}
    <span className="font-medium text-sm">{color}</span>
  </div>
);

const SizeOption = ({ size, selectedValue, handleClick }) => (
  <div
    className={`w-2/6 inline-block hover:border-gray-700 text-sm text-center border border-gray-200 rounded-md py-1.5 m-1 cursor-pointer ${
      selectedValue === size ? "border border-gray-700" : ""
    }`}
    onClick={() => handleClick(size)}
  >
    {size}
  </div>
);

function Filter(props) {
  const [filters, setFilters] = useState({
    category: props.category,
    minprice: "",
    maxprice: "",
    mindiscount: "",
    maxdiscount: "",
    price: "",
    discount: "",
    color: "",
    size: "",
  });
  const priceRanges = [
    { label: "Below $1000", value: "<1000" },
    { label: "$1000 - $2000", value: "1000-2000" },
    { label: "$2000 - $3000", value: "2000-3000" },
    { label: "Above $3000", value: ">3000" },
  ];
  const discountRanges = [
    { label: "Below 10%", value: "<10" },
    { label: "10% - 20%", value: "10-20" },
    { label: "20% - 30%", value: "20-30" },
    { label: "Above 30%", value: ">30" },
  ];
  const colors = [
    "blue",
    "gray",
    "green",
    "indigo",
    "pink",
    "purple",
    "red",
    "yellow",
  ];
  const sizes = [
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
  ];

  function changeFilters(key, value) {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [key]: value };

      if (key === "price") {
        switch (value) {
          case "<1000":
            updatedFilters.minprice = 0;
            updatedFilters.maxprice = 1000;
            break;
          case "1000-2000":
            updatedFilters.minprice = 1000;
            updatedFilters.maxprice = 2000;
            break;
          case "2000-3000":
            updatedFilters.minprice = 2000;
            updatedFilters.maxprice = 3000;
            break;
          case ">3000":
            updatedFilters.minprice = 3000;
            updatedFilters.maxprice = "";
            break;
          default:
            break;
        }
      }

      if (key === "discount") {
        switch (value) {
          case "<10":
            updatedFilters.mindiscount = 0;
            updatedFilters.maxdiscount = 10;
            break;
          case "10-20":
            updatedFilters.mindiscount = 10;
            updatedFilters.maxdiscount = 20;
            break;
          case "20-30":
            updatedFilters.mindiscount = 20;
            updatedFilters.maxdiscount = 30;
            break;
          case ">30":
            updatedFilters.mindiscount = 30;
            updatedFilters.maxdiscount = "";
            break;
          default:
            break;
        }
      }

      props.setFilters(updatedFilters);

      return updatedFilters;
    });
  }

  return (
    <>
      <h4 className="font-medium text-gray-800 mb-4">Price</h4>
      {priceRanges.map(({ label, value }, index) => (
        <Radio
          key={index}
          label={label}
          value={value}
          selectedValue={filters.price}
          handleChange={(value) => changeFilters("price", value)}
        />
      ))}
      <hr className="h-px my-4 bg-gray-200" />
      <h4 className="font-medium text-gray-800 mb-4">Offers</h4>
      {discountRanges.map(({ label, value }, index) => (
        <Radio
          key={index}
          label={label}
          value={value}
          selectedValue={filters.discount}
          handleChange={(value) => changeFilters("discount", value)}
        />
      ))}
      <hr className="h-px my-4 bg-gray-200" />
      <h4 className="font-medium text-gray-800">Color</h4>
      <div className="w-9/12 mt-2">
        {colors.map((color, index) => (
          <ColorOption
            key={index}
            color={color}
            selectedValue={filters.color}
            handleClick={(color) => changeFilters("color", color)}
          />
        ))}
      </div>
      <hr className="h-px my-4 bg-gray-200" />
      <h4 className="font-medium text-gray-800 mb-4">Size</h4>
      <div className="flex flex-wrap">
        {sizes.map((size, index) => (
          <SizeOption
            key={index}
            size={size}
            selectedValue={filters.size}
            handleClick={(size) => changeFilters("size", size)}
          />
        ))}
      </div>
    </>
  );
}

export default Filter;

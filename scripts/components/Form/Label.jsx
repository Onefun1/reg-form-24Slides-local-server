import React from "react";

const Label = ({ activeField, name, text }) => {
  return (
    <label
      className={`form__label ${activeField === name ? "show" : ""}`}
      htmlFor={name}
    >
      {text}
    </label>
  );
};

export default Label;

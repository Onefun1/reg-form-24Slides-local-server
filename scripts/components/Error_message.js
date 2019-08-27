import React from "react";
import PropTypes from "prop-types";

const Error_message = ({ error_message, message }) => {
  return (
    <span
      className={`form__error_message ${
        error_message ? "form__error_message-shown" : ""
      }`}
    >
      {message}
    </span>
  );
};

Error_message.propTypes = {
  error_message: PropTypes.bool.isRequired,
  message: PropTypes.string
};

Error_message.defaultProps = {
  message: "Invalid value"
};

export default Error_message;

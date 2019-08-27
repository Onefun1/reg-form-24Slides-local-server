import React from "react";
import PropTypes from "prop-types";

const Succsess_message = ({ succsess, hide, message }) => {
  return (
    <div className={`main__success-message ${succsess ? "show" : ""}`}>
      <div className="message__tittle">
        <span className="message__tittle-icon" />
        Great!
        <span onClick={hide} className="message__tittle-close-icon" />
      </div>
      <div className="message__message">{message}</div>
    </div>
  );
};

Succsess_message.propTypes = {
  succsess: PropTypes.bool.isRequired,
  hide: PropTypes.func
};

Succsess_message.defaultProps = {
  message: "your account has been successfully created."
};

export default Succsess_message;

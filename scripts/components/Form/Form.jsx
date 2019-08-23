import React, { Component } from "react";

import { getCountries } from "./get-data-from-server";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error_message: true
    };
    this.selectCountriesRef = React.createRef();
  }

  async componentDidMount() {
    const countries = await getCountries();

    this.setState({
      isLoading: true,
      countries
    });
  }

  render() {
    const { error_message, isLoading, countries } = this.state;

    return (
      <div className="container">
        <div className="container__title">Sign up</div>
        <form action="#!" className="container__form form">
          <label className="form__label" htmlFor="name">
            Name
          </label>
          <span className="bar" />
          <input
            className="form__input"
            type="text"
            id="name"
            required
            autoComplete="off"
            placeholder="Your name"
          />
          <label className="form__label" htmlFor="phone">
            Phone
          </label>
          <div className="form__wrapper">
            <select required className="form__select" defaultValue="null">
              <option value="null" disabled>
                Code
              </option>
              {isLoading && countries.length > 0
                ? countries.map(country => {
                    return (
                      <option
                        key={country.dial_code + country.name}
                        value={country.dial_code}
                      >
                        {`+ ${country.dial_code}`} &nbsp; &nbsp; &nbsp;
                        &nbsp;&nbsp; {`${country.name}`}
                      </option>
                    );
                  })
                : null}
            </select>

            <input
              className="form__input"
              type="tel"
              id="phone"
              autoComplete="off"
              required
              placeholder="Phone number"
            />
          </div>

          <label className="form__label" htmlFor="email">
            Email
          </label>
          <input
            className="form__input"
            type="email"
            id="email"
            autoComplete="off"
            required
            placeholder="Email address"
          />
          <label className="form__label" htmlFor="country">
            Country
          </label>
          <div className="form__wrapper" style={{ width: "100%" }}>
            <select
              className="form__select"
              id="country"
              required
              placeholder="Select country"
              ref={this.selectCountriesRef}
              defaultValue="1"
            >
              <option className="form-option" value="1" disabled>
                Select country
              </option>
              {isLoading && countries.length > 0
                ? countries.map(country => {
                    return (
                      <option
                        key={country.id + country.name}
                        value={country.name}
                      >
                        {country.name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <label className="form__label" htmlFor="password">
            Password
          </label>
          <input
            className="form__input"
            type="password"
            id="password"
            autoComplete="off"
            required
            placeholder="Password"
          />
          <label className="form__label" htmlFor="password_conf">
            Confirm password
          </label>
          <input
            className={`form__input ${
              error_message ? "form__input-not-valid" : "form__input-valid"
            }`}
            type="password"
            id="password_conf"
            autoComplete="off"
            required
            placeholder="Confirm your password"
          />
          <span
            className={`form__error_message ${
              error_message ? "form__error_message-shown" : ""
            }`}
          >
            Your password do not match
          </span>

          <label className="form__label-check" htmlFor="checkbox">
            <input
              className="form-label__input"
              type="checkbox"
              id="checkbox"
              required
            />
            <span className="check__box" />
            Yes, I'd like to recieve the very occasional email with information
            on new services and discounts
          </label>
          <div className="form__button">create an account</div>
          <p className="form__paragraph">
            Already have a 24Slides account? Click here to log in to your
            existing account and join a company team
          </p>
        </form>
      </div>
    );
  }
}

export default Form;

import React, { Component } from "react";

import { connect } from "react-redux";
import { addUser, getCountries } from "../../actions/actionCreator";

import { getCountriesFromServer, BASE_URL } from "./get-data-from-server";
import Error_message from "./Error_message";
import Succsess_message from "./Succsess_message";
import Label from "../Form/Label";
import ButtonSubmit from "../Form/ButtonSubmit";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error_message: false,
      form_sending: false,
      succsess: false,
      isLoaded: false,
      errors: [],
      length: 0,
      activeField: "",
      inputValue: ""
    };

    this.inputCountriesRef = React.createRef();
    this.inputNameRef = React.createRef();
    this.inputCodeRef = React.createRef();
    this.inputNumberRef = React.createRef();
    this.inputEmailRef = React.createRef();
    this.inputPasswordRef = React.createRef();
    this.inputPasswordConfirmRef = React.createRef();
    this.inputCheckboxConfirmRef = React.createRef();
  }

  async componentDidMount() {
    const countries = await getCountriesFromServer();

    const { getCountries } = this.props;
    getCountries(countries);

    this.setState({
      isLoaded: true
    });
    console.log("<==== Data loaded ===>");
  }

  handleSubmit = e => {
    e.preventDefault();

    this.setState({
      form_sending: true
    });

    let newUser = {
      name: this.inputNameRef.current.value,
      dialCode: this.inputCodeRef.current.value,
      number: this.inputNumberRef.current.value,
      email: this.inputEmailRef.current.value,
      country: this.inputCountriesRef.current.value,
      password: this.inputPasswordRef.current.value,
      passwordConfirmation: this.inputPasswordConfirmRef.current.value,
      confirm: this.inputCheckboxConfirmRef.current.checked
    };
    if (this.inputCountriesRef.current.value.includes("-")) {
      newUser.country = newUser.country.split("-")[1].trim("");
    }

    fetch(`${BASE_URL}register`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.status === "success") {
          this.setState({
            succsess: true,
            form_sending: false
          });

          const { addUser } = this.props;

          addUser(
            this.inputNameRef.current.value,
            this.inputCodeRef.current.value,
            this.inputNumberRef.current.value,
            this.inputEmailRef.current.value,
            this.inputCountriesRef.current.value,
            this.inputPasswordRef.current.value,
            this.inputPasswordConfirmRef.current.value,
            this.inputCheckboxConfirmRef.current.checked
          );

          this.inputNameRef.current.value = null;
          this.inputCodeRef.current.value = null;
          this.inputNumberRef.current.value = null;
          this.inputEmailRef.current.value = null;
          this.inputCountriesRef.current.value = null;
          this.inputPasswordRef.current.value = null;
          this.inputPasswordConfirmRef.current.value = null;
          this.inputCheckboxConfirmRef.current.checked = false;
        }
        if (response.errors) {
          let errors = response.errors.map((error, index) => {
            return error.param;
          });
          this.setState({
            form_sending: false,
            errors
          });
        }
      })
      .catch(error => console.error("Error:", error));
  };

  handlePasswordValidation = () => {
    if (
      this.inputPasswordRef.current.value !==
      this.inputPasswordConfirmRef.current.value
    ) {
      this.setState({
        error_message: true
      });
    }

    if (
      this.inputPasswordRef.current.value ===
      this.inputPasswordConfirmRef.current.value
    ) {
      this.setState({
        error_message: false
      });
    }
  };

  hideSuccsessMessage = () => {
    this.setState({
      succsess: false
    });
  };

  hendleChange = () => {
    this.setState(({ length }) => ({
      length: this.inputPasswordRef.current.value.length
    }));
  };

  handleFocus = ({ target }) => {
    this.setState({
      activeField: target.getAttribute("data-name")
    });
  };

  handleClickCode = ({ target }) => {
    this.inputCodeRef.current.value = target.getAttribute("data-name");

    this.setState({
      activeField: ""
    });
  };

  handleClickCountry = (country, country_code) => {
    this.inputCountriesRef.current.value = `${country} - ${country_code}`;
    this.setState({
      activeField: ""
    });
  };

  toggleClick = ({ target }) => {
    const { activeField } = this.state;

    if (activeField) {
      this.setState({
        activeField: ""
      });
      return;
    } else {
      this.setState({
        activeField: target.getAttribute("data-name")
      });
      return;
    }
  };

  handleChangeInputValue = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  render() {
    const {
      error_message,
      isLoaded,
      form_sending,
      succsess,
      errors,
      length,
      activeField
    } = this.state;

    const { countries } = this.props;

    const passValidate = error_message
      ? "form__input-not-valid"
      : length > 5
      ? "form__input-valid"
      : "";

    return (
      <main className="main">
        <Succsess_message succsess={succsess} hide={this.hideSuccsessMessage} />
        <div className="container">
          <div className="container__title">Sign up</div>

          <form
            onSubmit={e => this.handleSubmit(e)}
            className="container__form form"
          >
            <Label activeField={activeField} name={"name"} text={"Name"} />
            <input
              className="form__input"
              type="text"
              id="name"
              autoComplete="off"
              placeholder="Your name"
              ref={this.inputNameRef}
              onFocus={this.handleFocus}
              required
              data-name={"name"}
            />
            <Error_message error_message={errors.includes("name")} />
            <Label
              activeField={activeField}
              name={`${activeField === "phone" ? "phone" : "code"}`}
              text={`${activeField === "phone" ? "Phone" : "Code"}`}
            />
            <div className="form__wrapper">
              <input
                className={`form__input input_arrow ${
                  activeField === "code" ? "input_arrow-active" : ""
                }`}
                ref={this.inputCodeRef}
                id="code"
                data-name={"code"}
                placeholder="Code"
                type="number"
                onClick={this.toggleClick}
                autoComplete="off"
                onChange={this.handleChangeInputValue}
              />
              {activeField === "code" && (
                <div
                  className="drop-down-code__list"
                  onClick={this.handleClickCode}
                >
                  {isLoaded && countries.length > 0
                    ? countries.map(country => {
                        if (
                          String(country.dial_code).includes(
                            String(this.state.inputValue)
                          )
                        ) {
                          return (
                            <p
                              className="list__item"
                              data-name={country.dial_code}
                              key={`${country.dial_code}-${country.name}`}
                            >
                              <span
                                data-name={country.dial_code}
                                className="item-code"
                              >{`+ ${country.dial_code}`}</span>{" "}
                              <span
                                data-name={country.dial_code}
                                className="item-country"
                              >{`${country.name}`}</span>
                            </p>
                          );
                        } else {
                          return "";
                        }
                      })
                    : null}
                </div>
              )}

              <input
                className="form__input"
                type="tel"
                id="phone"
                type="number"
                autoComplete="off"
                placeholder=" Phone number"
                ref={this.inputNumberRef}
                onFocus={this.handleFocus}
                data-name={"phone"}
                autoComplete="off"
                required
              />
            </div>
            <Error_message error_message={errors.includes("dialCode")} />
            <Label activeField={activeField} name={"email"} text={"Email"} />
            <input
              className="form__input"
              type="email"
              id="email"
              autoComplete="off"
              placeholder="Email address"
              ref={this.inputEmailRef}
              onFocus={this.handleFocus}
              data-name={"email"}
              autoComplete="off"
            />
            <Error_message error_message={errors.includes("email")} />
            <Label
              activeField={activeField}
              name={"country"}
              text={"Country"}
            />
            <div className="form__wrapper">
              <input
                className={`form__input input_arrow ${
                  activeField === "country" ? "input_arrow-active" : ""
                }`}
                id="country"
                placeholder="Select country"
                ref={this.inputCountriesRef}
                onClick={this.toggleClick}
                data-name={"country"}
                autoComplete="off"
                onChange={this.handleChangeInputValue}
              />
              {activeField === "country" && (
                <div className="drop-down-country__list">
                  {isLoaded && countries.length > 0
                    ? countries.map(country => {
                        if (
                          country.name
                            .toLowerCase()
                            .includes(this.state.inputValue.toLowerCase()) ||
                          country.country_code
                            .toLowerCase()
                            .includes(this.state.inputValue.toLowerCase())
                        ) {
                          return (
                            <p
                              className="list__item"
                              onClick={() =>
                                this.handleClickCountry(
                                  country.name,
                                  country.country_code
                                )
                              }
                              data-name={country.country_code}
                              key={`${country.dial_code}__${country.name}`}
                            >
                              {country.name} - {country.country_code}
                            </p>
                          );
                        } else {
                          return "";
                        }
                      })
                    : ""}
                </div>
              )}
            </div>
            <Error_message
              error_message={errors.includes("country")}
              message="Invalid value (available only GB, US, UA)"
            />
            <Label
              activeField={activeField}
              name={"password"}
              text={"Password"}
            />
            <input
              className={`form__input ${passValidate} `}
              type="password"
              id="password"
              autoComplete="off"
              placeholder="Password"
              ref={this.inputPasswordRef}
              onChange={this.hendleChange}
              onFocus={this.handleFocus}
              data-name={"password"}
              autoComplete="off"
            />
            <Error_message error_message={errors.includes("password")} />
            <Label
              activeField={activeField}
              name={"password_conf"}
              text={"Confirm password"}
            />
            <input
              className={`form__input ${passValidate}`}
              type="password"
              id="password_conf"
              autoComplete="off"
              placeholder="Confirm your password"
              ref={this.inputPasswordConfirmRef}
              onChange={this.handlePasswordValidation}
              onFocus={this.handleFocus}
              data-name={"password_conf"}
            />
            <Error_message
              error_message={error_message}
              message={"Your password do not match"}
            />
            <label className="form__label-check" htmlFor="checkbox">
              <input
                className="form-label__input"
                type="checkbox"
                id="checkbox"
                ref={this.inputCheckboxConfirmRef}
                onFocus={this.handleFocus}
                data-name={"checkbox"}
              />
              <span className="check__box" />
              Yes, I'd like to recieve the very occasional email with
              information on new services and discounts
            </label>
            <ButtonSubmit form_sending={form_sending} isLoaded={isLoaded} />
            <p className="form__paragraph">
              Already have a 24Slides account?{" "}
              <a className="form__paragraph-link" href="https://24slides.com/">
                Click here
              </a>{" "}
              to log in to your existing account and join a company team
            </p>
            <br /> <br /> <br />
          </form>
        </div>
      </main>
    );
  }
}

export default connect(
  state => ({
    users: state.users,
    countries: state.countries
  }),
  { addUser, getCountries }
)(Form);

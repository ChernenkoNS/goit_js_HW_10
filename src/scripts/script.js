import "../css/styles.css";
import API from "./api.js";
import debounce from "lodash.debounce";
import Notiflix from "notiflix";

const DEBOUNCE_DELAY = 300;

const ref = {
  countryName: document.getElementById("search-box"),
  list: document.querySelector(".country-list"),
  info: document.querySelector(".country-info"),
};

ref.countryName.addEventListener("input", debounce(onSubmit, DEBOUNCE_DELAY));

function onSubmit(event) {
  const value = event.target.value.trim();
  event.preventDefault();
  if (value === "") {
    clearInput();
    return;
  } else
    API.getCountry(value)
      .then((results) => {
        if (results.length === 0)
          throw new Error("Oops, there is no country with that name");
        if (results.length > 10) {
          Notiflix.Notify.info(
            "Too many matches found. Please enter a more specific name."
          );
          return;
        }
        const curentFun = results.length === 1 ? createInfo : createList;
        const markup = results.reduce(
          (markup, result) => markup + curentFun(result),
          " "
        );

        if (results.length === 1) {
          updateInfo(markup);
        } else {
          updateList(markup);
        }
      })

      .catch(onError);
}

function createList({ name, flags }) {
  return `
      <img src="${flags.svg}" alt="${flags.alt} " width="50px"  >
      <h2>${name.official}</h2>
    `;
}

function createInfo({ name, flags, capital, population, languages }) {
  languages = Object.values(languages).join(", ");
  return `
  <h2>${name.common} (${name.official})</h2>
  <img src="${flags.svg}" alt="${flags.alt}" width="150px">
  <p>Capital: ${capital}</p>
  <p>Population: ${population.toLocaleString()}</p>
  <p>Languages: ${languages}</p>
`;
}

function updateList(markup) {
  ref.info.innerHTML = "";
  ref.list.innerHTML = markup;
}

function updateInfo(markup) {
  ref.list.innerHTML = "";
  ref.info.innerHTML = markup;
}

function clearInput() {
  ref.list.innerHTML = "";
  ref.info.innerHTML = "";
}

function onError(err) {
  Notiflix.Notify.failure("Oops, there is no country with that name");
}




 function getCountry(query) {
   return fetch(`https://restcountries.com/v3.1/name/${query}`)
   .then((res) => res.json())


 }

export default{ getCountry }
const apiURL = "http://localhost:2000";
const regexEmail = /^[\w\-\.]+(@[\w\-\.]+\.)+[\w\.\-]{2,4}$/;
const regexPassword = /^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*\-\_=<>,\.?]).{8,16}$/;

module.exports = { apiURL, regexEmail, regexPassword };

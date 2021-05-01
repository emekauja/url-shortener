require('dotenv').config();
const { nanoid } = require('nanoid');
const env = process.env;

const generateId = nanoid(6);
const preservedUrls = ['graphiql', 'api', '404', 'static'];

const addProtocol = (url) => {
  const hasProtocol = /^\w+:\/\//.test(url);
  return hasProtocol ? url : `http://${url}`;
};

const generateShortUrl = (id, host) => {
  const protocol =
    env.CUSTOM_DOMAIN_USE_HTTPS || !host ? 'https://' : 'http://';
  return `${protocol}${host || env.DEFAULT_DOMAIN}/${id}`;
};

// Function to check if the url entered is a valid URL
// source: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
const validateUrl = (url) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(url);
};

module.exports = {
  generateId,
  preservedUrls,
  addProtocol,
  generateShortUrl,
  validateUrl,
};

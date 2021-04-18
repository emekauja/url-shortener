const generate = require('nanoid/generate');

const generateId = async (/* domain_id = null */) => {
  const address = generate(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    env.LINK_LENGTH || 6
  );
  /*   const link = await query.link.find({ address, domain_id });
  if (!link) return address;
  return generateId(domain_id); */
  return address;
};

const addProtocol = (url) => {
  const hasProtocol = /^\w+:\/\//.test(url);
  return hasProtocol ? url : `http://${url}`;
};

const generateShortLink = (id, domain) => {
  const protocol =
    env.CUSTOM_DOMAIN_USE_HTTPS || !domain ? 'https://' : 'http://';
  return `${protocol}${domain || env.DEFAULT_DOMAIN}/${id}`;
};

// Function to check if the url entered is a valid URL
// source: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
const validateUrl = (url) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!pattern.test(url);
};

module.exports = {
  generateId,
  addProtocol,
  generateShortLink,
  validateUrl,
};

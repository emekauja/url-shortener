const db = require('../db');
const { preservedUrls } = require('../utils');

const redirect = async (req, res, next) => {
  try {
    const isPreservedUrl = preservedUrls.some(
      (item) => item === req.path.replace('/', '')
    );

    if (isPreservedUrl) return next();

    // short-circuit those annoying favicon requests in node.js
    if (req.url === '/favicon.ico') {
      req.end();
      console.log('favicon requested');
      return;
    }
    // Get URL
    const shortUrl = req.protocol + '://' + req.get('host') + req.url;
    const url = await db.url.findOne({ where: { shortUrl } });
    console.log(url);
    if (url) {
      const { longUrl } = url;

      // find a way to addd Create clickCount

      // Redirect to orignal url
      return res.redirect(longUrl);
    } else {
      // When no link, if has domain redirect to 400 or homepage
      // otherwise rediredt to 404
      res.status(400).send({
        message: 'URL not found!',
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = redirect;

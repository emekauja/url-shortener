module.exports = async (req, res, next) => {
  try {
    //const { id: shortUrl } = req.params;

    // Get URL
    const address = req.params.id.replace('+', '');
    const url = db.url.findOne({ shortUrl: address }).dataValues;

    if (url) {
      // Create clickCount
      //url.clickCount++;
      url.clickCount.add(1);
      await url.save();

      // Redirect to orignal url
      return res.redirect(url.longUrl);
    } else {
      // 3. When no link, if has domain redirect to domain's homepage
      // otherwise rediredt to 404
      return res.redirect(301, domain ? domain.homepage : '/404');
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.get404 = (req, res) =>
  res.render("404", {
    layout: false,
    Code: "404",
    Title: "صفحه پیدا نشد",
    Message: "صفحه ای که میخواهی را پیداش نمی کنم",
  });
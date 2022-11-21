exports.get404 = (req, res) => {
  return res.render("errors/404", {
    layout: false,
    Code: "404",
    pageTitle: "صفحه پیدا نشد",
    Message: "صفحه ای که میخواهی را پیداش نمی کنم",
    path: "/404",
  });
};
const buildCriteria = function (criteria) {
  var orderBy = criteria["orderBy"];
  if (orderBy == undefined) {
    return (a, b) => 0;
  } else if (orderBy == "Average Rating") {
    return (a, b) => {
      var ratesA = a.rates;
      if (ratesA === undefined) {
        ratesA = [];
      }
      var sumA = ratesA.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      var divA = Number(ratesA.length > 0 ? ratesA.length : 1);

      var avgA = sumA / divA;

      var ratesB = b.rates;
      if (ratesB === undefined) {
        ratesB = [];
      }

      var sumB = ratesB.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      var divB = Number(ratesB.length > 0 ? ratesB.length : 1);
      var avgB = sumB / divB;
      return avgB - avgA;
    };
  } else if (orderBy == "Availability Date") {
    //TODO
  } else if (orderBy == "Price") {
    return (a, b) => Number(a.price) - Number(b.price);
  }
};

module.exports = { buildCriteria };

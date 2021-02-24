module.exports = {
  formatDate: (date) => {
    let formatedDate = formatDate(date);
    return formatedDate;
  },
};

function formatDate(date) {
  if ((date.lenght = 12)) {
    let year = date.slice(0, 2);
    let month = date.slice(2, 4);
    let day = date.slice(4, 6);
    let hour = date.slice(6, 8);
    let minute = date.slice(8, 10);
    let second = date.slice(10, 12);

    let dateD = `${day}-${month}-20${year} ${hour}:${minute}:${second}`;
    return dateD;
  } else {
    return date;
  }
}

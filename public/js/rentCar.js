let form = document.getElementById('formularz');
const car_id = document.URL.slice(-8);
form.action = `/cars/rent/${car_id}`;

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}


const date = new Date();

let day = ("0" + date.getDate()).slice(-2);
let month = ("0" + (date.getMonth() + 1)).slice(-2);
let year = date.getFullYear();

let currentDate = `${year}-${month}-${day}`;
let end = document.getElementById('end');

end.value = currentDate;
end.min = currentDate;

const newDate = addDays(date, 31);

let futureDay = ("0" + newDate.getDate()).slice(-2);
let futureMonth = ("0" + (newDate.getMonth() + 1)).slice(-2);
let futureYear = newDate.getFullYear();

let futureDate = `${futureYear}-${futureMonth}-${futureDay}`;

end.max = futureDate;
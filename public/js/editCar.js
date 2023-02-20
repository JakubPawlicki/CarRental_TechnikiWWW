let select = document.getElementById('temp');
let normal = document.getElementById('n');
let premium = document.getElementById('p');
let luxury = document.getElementById('l');

if (select.innerText == "Normal") {
    normal.selected = "selected";
} else if (select.innerText == "Premium") {
    premium.selected = "selected";
} else {
    luxury.selected = "selected";
}

select.remove();
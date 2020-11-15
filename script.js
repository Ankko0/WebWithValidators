/* Массив данных. */
var mydata = [
    {id: "1", name: "Иван", surName: "Петров", birthday: "12-09-1970", city: "Москва"},
    {id: "2", name: "Регина", surName: "Жмышенко", birthday: "2-11-1982", city: "Санкт-Петербург"},
    {id: "3", name: "Семён", surName: "Рогачев", birthday: "06-07-1994", city: "Екатеринбург"}
];

/* Список ограничений для validate.js */
var constraints = {
    nameLength: {
        length: {maximum: 18, minimum: 2},
        format: {pattern: "[a-zA-Zа-яА-Я]+"}
    },

}

/* Создание таблицы после генерации DOM дерева. */
$(document).ready(function () {
    $("#jqGrid").jqGrid({
        datatype: "local",
        data: mydata,
        height: '100%',
        colModel: [
            {label: 'ID', name: 'id', width: 100, key: true},
            {label: 'Имя', name: 'name', width: 100},
            {label: 'Фамилия', name: 'surName', width: 100},
            {label: 'Дата рождения', name: 'birthday', width: 100},
            {label: 'Город', name: 'city', width: 100}
        ],
    });

});

/* Проверка длины имени. */
const nameInput = document.getElementById('nameInput')
nameInput.addEventListener('change', LengthValidator.bind(null, nameInput))

/* Проверка длины фамилии. */
const surnameInput = document.getElementById('surnameInput');
surnameInput.addEventListener('change', LengthValidator.bind(null, surnameInput));

/* Проверка корректности даты. */
document.getElementById('day').addEventListener('change', DataValidator);
document.getElementById('month').addEventListener('change', DataValidator);
document.getElementById('year').addEventListener('change', DataValidator);

/* Проверка выбраного города. */
document.getElementById('inputCity').addEventListener('change', CityValidator);

/* Добавление поля в таблицу после валидации всех полей. */
document.getElementById('submit').addEventListener('click', AddRow);

/* Валидация длины значения из поля field с помощью validate.js */
function LengthValidator(field) {
    const errors = validate({nameLength: field.value}, constraints);
    if (errors == null) {
        SetStdBorder(field);
        return true;
    } else {
        SetRedBorder(field)
        return false;
    }
}

/* Валидация введенной даты с помощью moment.js */
function DataValidator() {
    const day = document.getElementById('day');
    const month = document.getElementById('month');
    const year = document.getElementById('year');
    var isValid = moment(day.value + '-' + month.value + '-' + year.value, ['DD-MM-YYYY', "D-MM-YYYY",
        "D-MM-YYYY", "D-M-YYYY"], true).isValid();

    /* Проверка каждого поля на валидность (по условиям задачи).*/
    if (day.value === '') {
        SetRedBorder(day);
        return false;
    }
    else
        SetStdBorder(day);

    if (month.value === '') {
        SetRedBorder(month);
        return false;
    }
    else
        SetStdBorder(month);

    if (year.value === '') {
        SetRedBorder(year);
        return false;
    }
    else
        SetStdBorder(year);

    /* Проверка правильности всей даты. */
    if (!isValid) {
        SetRedBorder(day);
        SetRedBorder(month);
        SetRedBorder(year);
        return false;
    } else {
        SetStdBorder(day);
        SetStdBorder(month);
        SetStdBorder(year);
        return true;
    }
}

/* Валидация выбранного города. */
function CityValidator() {
    const city = document.getElementById('inputCity');
    if (city.value === 'Выберите город...') {
        SetRedBorder(city);
        return false;
    } else {
        SetStdBorder(city);
        return true;
    }
}

/* Обработка невалидных данных. Выделение неправильного инпута красным цветом. Можно добавить логику блокировки кнопки и т.д. */
function SetRedBorder(item) {
    item.style.borderColor = '#ec0303';
}

/* Обработка валидных данных. Стандартный цвет инпута.*/
function SetStdBorder(item) {
    item.style.borderColor = '#D4DCE0';
}

/* Добавление поля в jq Grid после проверки данных из полей. */
function AddRow() {
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    var maxId = 0;
    mydata.map(function (item) {
        if (item.id > maxId)
            maxId = item.id
    });
    maxId = +maxId + 1;
    if (LengthValidator(document.getElementById('nameInput')) &
        LengthValidator(document.getElementById('surnameInput')) &
        DataValidator() &
        CityValidator()) {
        document.getElementById('alert-danger').style.display = 'none';
        $("#jqGrid").addRowData(maxId.toString(),
            {
                name: $('#nameInput').val(),
                surName: $('#surnameInput').val(),
                birthday: day + '-' + month + '-' + year,
                city: $('#inputCity').val()
            },
            'last');
        $('#jqGrid').trigger('reloadGrid');
    } else {
        document.getElementById('alert-danger').style.display = 'block';
    }
}
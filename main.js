//'use strict';
function onPageLoading () {         //подгрузка страницы, проверка на наличие списка
    let ul = document.querySelector('ul.list');
    const data = localStorage.getItem("todos");
    if (data) {
        ul.innerHTML = data;
    }
    let check = document.querySelectorAll('input.state');
    let checkOriginal = JSON.parse(localStorage.getItem('check'));

    for (let i = 0; i < check.length; i++){ //перенос чеков
        checkOriginal[i] ? check[i].checked = 'checked' : check[i].checked = ''
    }
    let del = document.querySelectorAll('button.delete'); //привязка функции удаления к кнопке
    for (let i = 0; i< del.length; i++){
        del[i].onclick = Module.deleteData;
    }

}
    let Module = (function () {
        return {
            saveData: function () {  //сохранение списка в localStorage
                let ul = document.querySelector('ul.list');
                localStorage.clear();
                let arr = []; //сохраняю чеки отдельно, т.к. свойство по какой-то причине со сохраняется со списком
                for (let i = 0; i < ul.children.length; i++){
                    arr.push(ul.children[i].querySelector('input').checked);
                }
                localStorage.setItem('check', JSON.stringify(arr));
                localStorage.setItem("todos", ul.innerHTML);
            },
            filterDateTomorrow: function () { //фильтр по завтрашней дате !только завтра!
                let today = new Date();
                let tomorrow = new Date(today.valueOf() + 86400000);
                let ul = document.querySelector('ul.list');
                let templi = [];
                for (let i = 0; i< ul.children.length; i++){
                    if (new Date(ul.children[i].childNodes[1].textContent).getDate() !== tomorrow.getDate()){
                        templi.push(ul.children[i]); //пункт с НЕ завтрашней датой пушится вниз
                    }
                }
                templi.forEach((elem)=>{
                    ul.appendChild(elem); //перенос из массива для сортировки в объект
                });
            },
            filterDateWeek: function () { //фильтр недели !дата неделя или больше!
                let today = new Date();
                let nextWeek = new Date(today.valueOf() + 7*86400000);
                let ul = document.querySelector('ul.list');
                let li = ul.getElementsByTagName("LI");
                let templi = [];
                for (let elem of li) {
                    if (!((new Date(elem.childNodes[1].textContent).getDate() === nextWeek.getDate()) || (new Date(elem.childNodes[1].textContent).getDate() > nextWeek.getDate()))) {
                        templi.push(elem);
                    }
                }
                templi.forEach((elem)=>{
                    ul.append(elem);
                });
            },
            filterState: function () { //фильтр по состоянию
                let ul = document.querySelector('ul.list');
                let li = ul.getElementsByTagName("LI");
                let tempLi = [];
                for (let elem of li) {
                    elem.childNodes[2].checked ? 0 : tempLi.push(elem);
                }
                tempLi.forEach((elem)=>{
                    ul.append(elem); // не выполненные пункты пушатся вниз
                });
            },
            addData: function () { //добавление элемента списка
                const ul = document.querySelector('ul.list'); //получаем и создаем элементы
                const input = document.querySelector("input[type='text']");
                const date = document.querySelector("input[type='date']");
                let li = document.createElement('li');
                let span = document.createElement('span');
                let dateSpan = document.createElement('span');
                const deleteBtn = document.createElement('button');
                let checkBox = document.createElement('input');

                checkBox.type = "checkbox"; //добавляем классы и свойства
                checkBox.checked = '';
                checkBox.classList.add('checkbox');
                checkBox.classList.add('state');
                deleteBtn.classList.add('delete');
                deleteBtn.classList.add('btn');
                deleteBtn.classList.add('btn-outline-danger');
                deleteBtn.textContent = 'Удалить';
                deleteBtn.onclick = Module.deleteData;
                span.classList.add('content');
                dateSpan.classList.add('date');
                li.classList.add('item');
                li.classList.add('list-group-item');

                dateSpan.append(date.value); //помещаем значения
                span.append(input.value);
                li.append(span, dateSpan, checkBox, deleteBtn);
                ul.appendChild(li);
            },
            deleteData: function () { //функция удаления пункта списка
                event.target.parentElement.remove(); //удаление родительского для кнопки элемента
            },

        };
    })();

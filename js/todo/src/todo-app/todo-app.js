(function () {
  // создаем и возвращаем заголовк приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }
  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }
  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name, done = false) {
    let item = document.createElement("li");
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    item.textContent = name;

    if (done) {
      item.classList.add("list-group-item-success");
    }

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(container, title, myTodos = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    const myTitle = document.getElementsByTagName("h2")[0].textContent;
    let myTodoArr = [];

    function storage() {
      if (myTitle == "Мои дела") {
        localStorage.setItem("MyTodo", JSON.stringify(myTodoArr));
      } else if (myTitle == "Дела папы") {
        localStorage.setItem("DadTodo", JSON.stringify(myTodoArr));
      } else {
        localStorage.setItem("MomTodo", JSON.stringify(myTodoArr));
      }
      return localStorage;
    }

    function addDone(todo) {
      myTodoArr.forEach((item) => {
        if (item.name === todo.item.firstChild.textContent) {
          item.done = !item.done;
        }
      });
    }

    function removeTodo(todo) {
      myTodoArr.forEach((item) => {
        if (item.name === todo.item.firstChild.textContent) {
          myTodoArr.splice(myTodoArr.indexOf(item), 1);
        }
      });
    }

    function addMyTodos() {
      myTodos.forEach((elem) => {
        let myItem = createTodoItem(elem.name, elem.done);

        todoList.append(myItem.item);
        myTodoArr.push(elem);

        myItem.doneButton.addEventListener("click", () => {
          myItem.item.classList.toggle("list-group-item-success");

          addDone(myItem);
          storage();
        });

        myItem.deleteButton.addEventListener("click", function () {
          if (confirm("Вы уверены?")) {
            myItem.item.remove();
            removeTodo(myItem);
          }

          storage();
        });
      });
    }

    addMyTodos();

    todoItemForm.input.addEventListener("input", function () {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      } else {
        todoItemForm.button.disabled = true;
      }
    });

    // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строчка необходима, чтобы предотвратить стандартное поведение браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }
      todoItemForm.button.disabled = true;

      let todoItem = createTodoItem(todoItemForm.input.value);

      myTodoArr.push({ name: todoItemForm.input.value, done: false });

      storage();

      // добавляем обработчики на формы
      todoItem.doneButton.addEventListener("click", function () {
        todoItem.item.classList.toggle("list-group-item-success");

        addDone(todoItem);
        storage();
      });

      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoItem.item.remove();
          removeTodo(todoItem);
        }

        storage();
      });

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();

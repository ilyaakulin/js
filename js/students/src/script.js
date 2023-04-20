(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const students = [
      {
        name: "Илья",
        surname: "Акулин",
        patronymic: "Тимофеевич",
        dateOfBirth: "1997-11-29",
        dateOfAdmission: 2016,
        faculty: "Маркетинг",
      },
      {
        name: "Полина",
        surname: "Окунева",
        patronymic: "Александровна",
        dateOfBirth: "1999-06-08",
        dateOfAdmission: 2018,
        faculty: "Дизайн",
      },
      {
        name: "Кирилл",
        surname: "Жуковский",
        patronymic: "Сергеевич",
        dateOfBirth: "1997-06-11",
        dateOfAdmission: 2021,
        faculty: "Программирование",
      },
      {
        name: "Никита",
        surname: "Иващенко",
        patronymic: "Сергеевич",
        dateOfBirth: "1997-10-31",
        dateOfAdmission: 2015,
        faculty: "Психология",
      },
    ];
    let studentsCopy = [...students];
    const student = {
      name: null,
      surname: null,
      patronymic: null,
      dateOfBirth: null,
      dateOfAdmission: null,
      faculty: null,
    };
    const addStudentBtn = document.querySelector(".add-student");
    const inputs = document.querySelectorAll(".add-inputs");
    const findInputs = document.querySelectorAll(".find-input");
    const btnWrap = document.querySelector(".btn-wrap");
    const inputDate = document.getElementById("date-of-birth-input");
    const inputYear = document.getElementById("date-of-admission-input");
    const tBody = document.querySelector(".t-body");
    const name = document.querySelector(".name");
    const faculty = document.querySelector(".faculty");
    const dateOfBirth = document.querySelector(".age");
    const dateOfAdmission = document.querySelector(".studying");
    const CURRENT_DATE = new Date();
    const startDate = new Date(1900, 01, 01);
    const year = 2000;

    showStudent(studentsCopy);

    function isLegal() {
      addStudentBtn.addEventListener("click", (target) => {
        target.preventDefault();

        clearWarnings("warning");

        const empty = isEmpty(inputs);
        const legalDate = isLegalDate(inputDate.value);
        const legalYear = isLegalYear(
          inputYear,
          year,
          CURRENT_DATE.getFullYear()
        );

        if (empty) {
          addMessage(btnWrap, "Заполните все поля");
        }

        if (!legalDate) {
          addMessage(btnWrap, "Неверная дата рождения");
          inputDate.classList.add("empty");
        }

        if (!legalYear) {
          addMessage(btnWrap, "Неверная дата поступления");
          inputYear.classList.add("empty");
        }

        if (!empty && legalDate && legalYear) {
          students.push(getStudent(inputs, student));
          clearInputs(inputs);
          clearTable(tBody);
          studentsCopy = [...students];
          filter(name, studentsCopy, sortName);
          filter(faculty, studentsCopy, sortFaculty);
          filter(dateOfBirth, studentsCopy, sortBirth);
          filter(dateOfAdmission, studentsCopy, sortYear);
          showStudent(studentsCopy);
        }
      });
    }
    isLegal();

    function removeClass(arr, mod) {
      arr.forEach((elem) => {
        elem.addEventListener("input", () => {
          elem.classList.remove(mod);
        });
      });
    }

    removeClass(inputs, "empty");

    function addMessage(field, message) {
      const warning = document.createElement("span");
      warning.textContent = message;
      warning.classList.add("warning");
      field.prepend(warning);
    }

    function isEmpty(arr) {
      let empty = false;
      arr.forEach((elem) => {
        if (!elem.value.trim()) {
          elem.classList.add("empty");
          empty = true;
        }
      });
      return empty;
    }

    function isLegalDate(date) {
      const myDate = new Date(date.split("-").join(","));
      let isLegal = null;
      myDate >= startDate && myDate < CURRENT_DATE
        ? (isLegal = true)
        : (isLegal = false);
      return isLegal;
    }

    function clearWarnings(warning) {
      const warnings = document.querySelectorAll("." + warning);
      warnings.forEach((elem) => {
        elem.remove();
      });
    }

    function isLegalYear(elem, min, max) {
      let isLegal = null;
      elem.value <= max && elem.value >= min
        ? (isLegal = true)
        : (isLegal = false);
      return isLegal;
    }

    function getStudent(arr, obj) {
      const newStudent = {};
      let counter = 0;

      for (const i in obj) {
        newStudent[i] = beautify(arr[counter].value.trim());
        counter++;
      }

      return newStudent;
    }

    function clearInputs(arr) {
      arr.forEach((elem) => {
        elem.value = "";
      });
    }

    function showStudent(arr) {
      arr.forEach((elem) => {
        const name = document.createElement("td");
        const faculty = document.createElement("td");
        const fullYears = document.createElement("td");
        const course = document.createElement("td");
        const th = document.createElement("th");
        const tr = document.createElement("tr");

        name.textContent = `${elem.surname} ${elem.name} ${elem.patronymic}`;
        faculty.textContent = elem.faculty;

        th.scope = "row";
        th.textContent = arr.indexOf(elem) + 1;

        fullYears.textContent = `${elem.dateOfBirth
          .split("-")
          .reverse()
          .join(".")} (${calculateAge(elem.dateOfBirth)} лет)`;

        course.textContent = calculateCourse(elem.dateOfAdmission);

        tr.append(th, name, faculty, fullYears, course);

        tBody.append(tr);
      });
    }

    function beautify(elem) {
      const newStr = elem.toLowerCase();
      return newStr[0].toUpperCase() + newStr.slice(1);
    }

    function calculateAge(date) {
      const myDate = new Date(date.split("-").join(","));
      let years = null;
      myDate.getMonth() > CURRENT_DATE.getMonth()
        ? (years = CURRENT_DATE.getFullYear() - myDate.getFullYear() - 1)
        : (years = CURRENT_DATE.getFullYear() - myDate.getFullYear());
      return years;
    }

    function calculateCourse(date) {
      const yearsOfStudying = 4;
      const periodOfStudying = `${date}-${Number(date) + yearsOfStudying}`;
      const difference = CURRENT_DATE.getFullYear() - Number(date);
      let course = null;

      if (difference < 4) {
        course = `(${difference} курс)`;
      } else if (difference > 4) {
        course = "(Закончил)";
      } else if (difference == 4) {
        if (CURRENT_DATE.getMonth() > 9) {
          course = "(Закончил)";
        } else {
          course = `(${difference} курс)`;
        }
      }

      return `${periodOfStudying} ${course}`;
    }

    function clearTable(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    function filter(elem, arr, func) {
      elem.addEventListener("click", () => {
        arr = arr.sort(func);
        clearTable(tBody);
        showStudent(arr);
      });
    }

    filter(name, studentsCopy, sortName);
    filter(faculty, studentsCopy, sortFaculty);
    filter(dateOfBirth, studentsCopy, sortBirth);
    filter(dateOfAdmission, studentsCopy, sortYear);

    function sortName(x, y) {
      if (
        x.surname + x.name + x.patronymic <
        y.surname + y.name + y.patronymic
      ) {
        return -1;
      }
      if (
        x.surname + x.name + x.patronymic >
        y.surname + y.name + y.patronymic
      ) {
        return 1;
      }
      return 0;
    }

    function sortFaculty(x, y) {
      if (x.faculty > y.faculty) {
        return 1;
      }
      if (x.faculty < y.faculty) {
        return -1;
      }
      return 0;
    }

    function sortBirth(x, y) {
      if (
        new Date(x.dateOfBirth.split("-").join(",")) <
        new Date(y.dateOfBirth.split("-").join(","))
      ) {
        return 1;
      }
      if (
        new Date(x.dateOfBirth.split("-").join(",")) >
        new Date(y.dateOfBirth.split("-").join(","))
      ) {
        return -1;
      }
      return 0;
    }

    function sortYear(x, y) {
      if (x.dateOfAdmission > y.dateOfAdmission) {
        return 1;
      }
      if (x.dateOfAdmission < y.dateOfAdmission) {
        return -1;
      }
      return 0;
    }

    function finder(arr) {
      const nameFinder = document.querySelector(".name-finder");
      const facultyFinder = document.querySelector(".faculty-finder");
      const admissionFinder = document.querySelector(".start-year-finder");
      const finishFinder = document.querySelector(".end-year-finder");
      arr.forEach((elem) => {
        elem.addEventListener("input", () => {
          if (elem.classList.contains("name-finder")) {
            studentsCopy = [...students];
            clearTable(tBody);
            findFaculty(facultyFinder.value.trim().toLowerCase());
            findAdmissionDate(admissionFinder.value);
            findFinishDate(finishFinder.value);
            showStudent(findName(nameFinder.value.trim().toLowerCase()));
            filter(name, studentsCopy, sortName);
            filter(faculty, studentsCopy, sortFaculty);
            filter(dateOfBirth, studentsCopy, sortBirth);
            filter(dateOfAdmission, studentsCopy, sortYear);
          }
          if (elem.classList.contains("faculty-finder")) {
            studentsCopy = [...students];
            clearTable(tBody);
            findName(nameFinder.value.trim().toLowerCase());
            findAdmissionDate(admissionFinder.value);
            findFinishDate(finishFinder.value);
            showStudent(findFaculty(facultyFinder.value.trim().toLowerCase()));
            filter(name, studentsCopy, sortName);
            filter(faculty, studentsCopy, sortFaculty);
            filter(dateOfBirth, studentsCopy, sortBirth);
            filter(dateOfAdmission, studentsCopy, sortYear);
          }
          if (elem.classList.contains("start-year-finder")) {
            studentsCopy = [...students];
            clearTable(tBody);
            findName(nameFinder.value.trim().toLowerCase());
            findFaculty(facultyFinder.value.trim().toLowerCase());
            findFinishDate(finishFinder.value);
            showStudent(findAdmissionDate(admissionFinder.value));
            filter(name, studentsCopy, sortName);
            filter(faculty, studentsCopy, sortFaculty);
            filter(dateOfBirth, studentsCopy, sortBirth);
            filter(dateOfAdmission, studentsCopy, sortYear);
          }
          if (elem.classList.contains("end-year-finder")) {
            studentsCopy = [...students];
            clearTable(tBody);
            findName(nameFinder.value.trim().toLowerCase());
            findFaculty(facultyFinder.value.trim().toLowerCase());
            findAdmissionDate(admissionFinder.value);
            showStudent(findFinishDate(finishFinder.value));
            filter(name, studentsCopy, sortName);
            filter(faculty, studentsCopy, sortFaculty);
            filter(dateOfBirth, studentsCopy, sortBirth);
            filter(dateOfAdmission, studentsCopy, sortYear);
          }
        });
      });
    }

    finder(findInputs);

    function findName(value) {
      studentsCopy = studentsCopy.filter(
        (el) =>
          el.name.toLowerCase().includes(value) ||
          el.surname.toLowerCase().includes(value) ||
          el.patronymic.toLowerCase().includes(value)
      );
      return studentsCopy;
    }

    function findFaculty(value) {
      studentsCopy = studentsCopy.filter((el) =>
        el.faculty.toLowerCase().includes(value)
      );
      return studentsCopy;
    }

    function findAdmissionDate(value) {
      value == ""
        ? studentsCopy
        : (studentsCopy = studentsCopy.filter(
            (el) => el.dateOfAdmission == value
          ));
      return studentsCopy;
    }

    function findFinishDate(value) {
      value == ""
        ? studentsCopy
        : (studentsCopy = studentsCopy.filter(
            (el) => +el.dateOfAdmission + 4 == value
          ));
      return studentsCopy;
    }
  });
})();

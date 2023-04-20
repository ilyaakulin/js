// token b9088c6da3929ff13b0f24855fdef38a4664ee8e537f186a32c546c61de56e73

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    let paginationCounter = 1;

    async function getDataFromServer(page) {
      const response = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`);
      const data = await response.json();
      return data;
    }

    async function showArticlesList(obj) {
      const response = await obj;

      const ul = document.querySelector(".articles");
      ul.innerHTML = '';

      response.data.forEach((element) => {
        const ul = document.querySelector(".articles");
        const li = document.createElement("li");
        const link = document.createElement('a');

        link.textContent = element.title;
        link.target = '_blank';
        link.href = `./article.html?id=${element.id}`
        li.classList.add("list-group-item");
        li.append(link);
        ul.append(li);
      });
    }

     function createApp (page) {
       showArticlesList(getDataFromServer(page))
       createPagination(getDataFromServer(page))
    }

    async function createPagination(obj) {
      const response = await obj;
      let number = response.meta.pagination.pages;
      const ul = document.querySelector(".pagination");
      ul.innerHTML = '';

      for (let i = paginationCounter; i <= number; i++) {
        if (i < (paginationCounter + 5)) {
          createPaginationElements(i)
        }
      }
      showPage()
    }

    function createPaginationElements(content) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      const ul = document.querySelector(".pagination");

      li.classList.add("pagination__item");
      a.classList.add("pagination__link");
      a.textContent = content;
      a.href = "#";
      li.append(a);
      ul.append(li);
    }

    function switchPages () {
      const nextBtn = document.querySelector('.pagination-btn-next');
      const prevBtn = document.querySelector('.pagination-btn-prev');

      nextBtn.addEventListener('click', ()=> {
        ++paginationCounter;
        createApp(paginationCounter)
      })
      prevBtn.addEventListener('click', ()=> {
        --paginationCounter;
        createApp(paginationCounter)
      })
    }
    switchPages()

    function showPage () {
      const pages = document.querySelectorAll('.pagination__link');

      pages.forEach((elem)=>{
        elem.addEventListener('click', (target)=>{
          target.preventDefault();
          createApp(+elem.textContent)
        })
      })
    }

    createApp(paginationCounter)
  });
})();

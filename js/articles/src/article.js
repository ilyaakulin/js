(function () {
  document.addEventListener('DOMContentLoaded', ()=> {

     async function getDataFromServer () {
      const pageParams = new URLSearchParams(window.location.search);
      const response = await fetch(`https://gorest.co.in/public-api/posts/${pageParams.get('id')}`);
      const article = await response.json();
      const responseComment = await fetch(`https://gorest.co.in/public-api/comments?post_id=${pageParams.get('id')}`);
      const comment = await responseComment.json();
      const data = [article, comment];
      return data;
    }

    async function showArticle (obj) {
      const response = await obj;
      const [article, comment] = response;
      const title = document.querySelector('.title')
      const descr = document.querySelector('.descr')
      const list = document.querySelector('.comment')
      descr.textContent = article.data.body
      title.textContent = article.data.title

      comment.data.forEach(element => {
        const ul = document.createElement('ul')
        const {name, email, body} = element;

        const liName = document.createElement('li')
        const liEmail = document.createElement('li')
        const liBody = document.createElement('li')

        liName.textContent = name;
        liEmail.textContent = email;
        liBody.textContent = body;

        ul.append(liName, liEmail, liBody)
        ul.classList.add('user')
        list.append(ul)

      });
    }

    showArticle(getDataFromServer())

  })
})()

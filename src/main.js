import i18next from 'i18next'
import * as yup from 'yup'
import updateUi from './view.js'
import axios from 'axios';
import _ from 'lodash'

// const i18nextInstance = i18next.createInstance();
// i18nextInstance.then((i18nextInstance) =>  i18nextInstance.init({
//     // конфигурация i18next
//     lng: 'ru',
//     debug: true,
//     resources: {
//       ru,
//     },
//   }))

const initialState = {
  stateData: {
    feeds:[],
    posts:[],
  },
  formState: {
    isValid: null,
    error:'',
   },
  loadingProcess: {
    status: 'idle', // success, failed, loading, idle - начальный статус 
    error: '', // code error
   },
};


const inputField = document.querySelector('#url-input');
const form = document.querySelector('.rss-form');
const feedback = document.querySelector('.feedback');
const submitButton = form.querySelector('button');

const watch = updateUi(initialState, inputField, feedback, submitButton, form);

// проверяем валидность ссылки
const validate = (field, feeds) => {
  const urlSchema = yup.object({
    url: yup.string().url().notOneOf(feeds)
  });
  return urlSchema.validate({url: field})
    .then(() => null) 
    .catch((e) => e.message)
}

const parseRss = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, "application/xml");
}

 const loadRss = (url, watchedState) => {
  let id = _.uniqueId();
  return axios(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
  .then(response => response.data.contents)
  .then(data => parseRss(data))
  .then((document) => {
    const feed = {id, url};
    watchedState.stateData.feeds.push(feed);
    return document.querySelectorAll('item')
  })
  .then(items => items.forEach(item => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');
    const post = {id, postId: _.uniqueId(), title: title.textContent, description: description.textContent, link: link.textContent}
    watchedState.stateData.posts.push(post);
    watchedState.loadingProcess = { status: 'success'}
  console.log(post)}))
  .catch(error => {
    watchedState.loadingProcess = {status: 'failed', error: error.message}
  } )
};

form.addEventListener('submit',  (e) => {
  e.preventDefault();
  const inputValue = e.target.querySelector('input').value;
  const urls = watch.stateData.feeds.map((feed) => feed.url);
  validate(inputValue, urls).then((err) => {
    if (err) {
     watch.formState = { isValid: false, error: err};
    } 
    else  {
      watch.formState = { isValid: true, error: ''};
      watch.loadingProcess = { status: 'loading'}
      // вызываем загрузку, парсим данные и параллельно проверяем валидность rss, если rss
      loadRss(inputValue, watch);
      console.log(watch)
    }
  });
});



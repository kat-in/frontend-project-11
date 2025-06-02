import i18next from 'i18next';
import * as yup from 'yup';
import updateUi from './view.js';
import axios from 'axios';
import _ from 'lodash';
import ru from './locales/index.js';

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: false,
  resources: { ru },
}).then((t) => { t('key') });

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
const feeds = document.querySelector('.feeds');
const posts = document.querySelector('.posts');

const watchedState = updateUi(initialState, inputField, feedback, submitButton, form, feeds, posts, i18nextInstance);

// проверяем валидность ссылки
const validate = (field, feeds) => {
  yup.setLocale(ru.translation.validation.yup);
  const urlSchema = yup.object({
    url: yup.string().url().notOneOf(feeds)
  });
  return urlSchema.validate({url: field})
    .then(() => null) 
    .catch((e) => e.message)
}

const parseRss = (data, i18n) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/xml");
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(i18n.t('validation.invalidRss'));
  }
  return doc;
}

const loadRss = (url, state, i18n) => {
  let id = _.uniqueId();
  return axios(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then(response => response.data.contents)
    .then(data => parseRss(data, i18n))
    .then((document) => {
      const feedTitle = document.querySelector('title');
      const feedDescription = document.querySelector('description');
      const feed = {id, url, title: feedTitle.textContent, description: feedDescription.textContent };
      state.stateData.feeds.push(feed);
      state.loadingProcess = { status: 'success'}
      return document.querySelectorAll('item')
    })
    .then(items => items.forEach(item => {
      const title = item.querySelector('title');
      const description = item.querySelector('description');
      const link = item.querySelector('link');
      const post = {feedId: id, postId: _.uniqueId(), title: title.textContent, description: description.textContent, link: link.textContent}
      state.stateData.posts.push(post);
      console.log(post)}))
    .catch(error => {
      state.loadingProcess = { status: 'failed', error: error.message }
    })
};



form.addEventListener('submit',  (e) => {
  e.preventDefault();
  const inputValue = e.target.querySelector('input').value;
  const urls = watchedState.stateData.feeds.map((feed) => feed.url);
  validate(inputValue, urls).then((err) => {
    if (err) {
      watchedState.formState = { isValid: false, error: err};
    } 
    else  {
      watchedState.formState = { isValid: true, error: ''};
      watchedState.loadingProcess = { status: 'loading'}
      // вызываем загрузку, парсим данные и параллельно проверяем валидность rss, если rss
      loadRss(inputValue, watchedState, i18nextInstance);
      console.log(watchedState);
    }
  });
});



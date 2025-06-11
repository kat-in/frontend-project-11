import i18next from 'i18next';
import ru from './locales/index.js';
import * as yup from 'yup';
import updateUi from './view.js';
import axios from 'axios';
import _ from 'lodash';

import parseRss from './parserRss.js';

const init = () => {
  const i18nextInstance = i18next.createInstance();
  const initialState = {
    stateData: {
      feeds:[],
      posts:[],
    },
    ui: {
      modal: {
        title: '',
        description: '',
      },
      viewedPosts: new Set([]),
    },
    formState: {
      isValid: null,
      error:'',
    },
    loadingProcess: {
     status: 'idle', // success, failed, loading, idle - начальный статус 
     error: '', 
    },
};

  const elements = {
    inputField: document.querySelector('#url-input'),
    form : document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('button'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  // функция валидации
  const validate = (field, feeds, locale) => {
    yup.setLocale(locale);
    const urlSchema = yup.object({
      url: yup.string().url().notOneOf(feeds)
    });
    return urlSchema.validate({url: field})
    .then(() => null) 
    .catch((e) => e.message)
  };

  // функция прокси
  const proxy = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

  // функция загрузки постов
  const loadPosts = (items, feedId, state) => {
    items.forEach(item => {
      const title = item.querySelector('title');
      const description = item.querySelector('description');
      const link = item.querySelector('link');
         
      const oldPosts = state.stateData.posts.filter((post)=> post.feedId === feedId)
        .map(post => post.title);
      const newPost = !oldPosts.includes(title.textContent)? item : null;
      if (newPost !== null) {
        const post = {
          feedId: feedId,
          postId: _.uniqueId(),
          title: title.textContent,
          description: description.textContent,
          link: link.textContent,
        }
        state.stateData.posts.push(post);
      } 
    });
  }

  // функция загрузки Rss
  const loadRss = (url, state, i18n) => {
    axios.defaults.timeout = 10000;
    let id = _.uniqueId();
    return axios(proxy(url))
    .then(response => {
      const data = response.data.contents;
      const document = parseRss(data, i18n);
      const feedTitle = document.querySelector('title');
      const feedDescription = document.querySelector('description');
      const feed = { id, url, title: feedTitle.textContent, description: feedDescription.textContent };
      state.stateData.feeds.push(feed);
      state.loadingProcess = { status: 'success'};
      const items = document.querySelectorAll('item')
      loadPosts(items, feed.id, state);
    })
    .catch((e) => {
      if (e.name === 'Error') {
          state.loadingProcess = { status: 'failed', error: i18n.t('validation.invalidRss') };
      }
      if (e.name ==='AxiosError') {
        state.loadingProcess = { status: 'failed', error: i18n.t('validation.networkError') };
      }
      else {
        state.loadingProcess = { status: 'failed', error: e.message };
      }
    }) 
  };

  // функция обновления RSS
  const updateRss = (state, i18n) => {
    axios.defaults.timeout = 10000;
    const updateUrls = state.stateData.feeds.map((feed) => {
      axios(proxy(feed.url))
      .then(response => {
        const data = response.data.contents;
        const document = parseRss(data, i18n);
        const items = document.querySelectorAll('item');
        loadPosts(items, feed.id, state);
      })
      .catch(error => console.log(error.message))
    })
    Promise.all(updateUrls).then(() => { setTimeout(() => updateRss(state, i18n), 5000) })
      .catch(error => console.log(error.message));
  }

  Promise.resolve(
    i18nextInstance.init({
      lng: 'ru',
      debug: false,
      resources: { ru },
    })
  ).then(() => { 
    const watchedState = updateUi(initialState, elements, i18nextInstance);
    updateRss(watchedState, i18nextInstance);

    elements.posts.addEventListener('click', (e) => {
      if (!e.target.dataset.bsToggle) {
        return;
      } else {
        const postTitle = e.target.dataset.id;
        const post = watchedState.stateData.posts.find((post) => post.title === postTitle);
        watchedState.ui.viewedPosts = watchedState.ui.viewedPosts.add(post.postId);
        watchedState.ui.modal = { title: post.title, description: post.description, url: post.link }
      }
    });

    elements.form.addEventListener('submit',  (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const inputValue = formData.get('url');
      const urls = watchedState.stateData.feeds.map((feed) => feed.url);
      validate(inputValue, urls, ru.translation.validation.yup).then((error) => {
        if (error) {
          watchedState.formState = { isValid: false, error: error};
          return;
        } 
        else  {
          watchedState.formState = { isValid: true, error: ''};
          watchedState.loadingProcess = { status: 'loading'}
          loadRss(inputValue, watchedState, i18nextInstance);
        }
      });
    });
  });
}

export default init;


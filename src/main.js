import i18next from 'i18next'
import * as yup from 'yup'
import updateUi from './view.js'
import axios from 'axios';
// import axios from 'axios';

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

const urlSchema = yup.object({
  url: yup.string().url('Ссылка должна быть валидным URL').notOneOf(initialState.stateData.feeds, 'Такая ссылка уже есть')
})

const inputField = document.querySelector('#url-input');
const form = document.querySelector('.rss-form');
const feedback = document.querySelector('.feedback');
const submitButton = form.querySelector('button');

const watch = updateUi(initialState, inputField, feedback, submitButton);

// проверяем валидность ссылки
const isValid = (field) => {
  return urlSchema.validate({url: field})
    .then(() => null) 
    .catch((e) => e.message)
}

 const loadRss = (url) => {
  return axios(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
  .then(response => response.data)
  .catch(error => error.message)
};

// const parseRss = (data) => {
//   const parser = new DOMParser();
//   const rssData = parser.parseFromString(data,"text/xml");
//   console.log(rssData);
// }


form.addEventListener('submit',  (e) => {
  e.preventDefault();
  const inputValue = e.target.querySelector('input').value;
  isValid(inputValue).then((err) => {
    if (err) {
     watch.formState = { isValid: false, error: err};
    } 
    else  {
      watch.formState = { isValid: true, error: ''};
      watch.loadingProcess = { status: 'loading'}
      // вызываем загрузку, парсим данные и параллельно проверяем валидность rss, если rss
      loadRss(inputValue).then(data => console.log(data));
    }
  });
});



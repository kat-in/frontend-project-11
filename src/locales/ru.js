export default {
  translation: {
    posts: 'Посты',
    feeds: 'Фиды',
    viewButton: 'Просмотр',
    validation: {
      yup: {
        mixed: {
          default: 'Некорректное значение',
          notOneOf: 'RSS уже существует',
          required: 'Не должно быть пустым',
        },
        string: {
          url: 'Ссылка должна быть валидным URL',
        },
      },
      networkError: 'Ошибка сети',
      invalidRss: 'Ресурс не содержит валидный RSS',
      success: 'RSS успешно загружен',
    },
  },
}

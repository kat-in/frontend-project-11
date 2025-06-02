export default {
  translation: {
    posts: 'Посты',
    feeds: 'Фиды',
    viewButton: 'Просмотр',
    validation: {
      yup: {
        mixed: {
          default: 'Некорректное значение',
          notOneOf: 'Такая ссылка уже есть',
        },
        string: {
          url: 'Ссылка должна быть валидным URL',
        }
      },
      networkError: 'Ошибка сети',
      invalidRss: 'Ресурс не содержит валидный RSS',
      success: 'RSS успешно загружен',
    },
  }
}
import onChange from 'on-change'

const renderPosts = (posts, state, i18n) => {
  posts.textContent = ''
  const postsSectionTitle = document.createElement('h2')
  postsSectionTitle.textContent = i18n.t('posts')
  state.stateData.posts.forEach((post) => {
    const postItem = document.createElement('div')
    postItem.classList.add('d-flex', 'justify-content-between', 'py-2')
    const postLink = document.createElement('a')
    postLink.target = '_blank'
    if (state.ui.viewedPosts.has(post.postId)) {
      postLink.classList.remove('fw-bold', 'text-primary')
      postLink.classList.add('text-secondary', 'fw-normal')
    }
    else {
      postLink.classList.add('fw-bold')
    }
    const button = document.createElement('button')
    button.textContent = i18n.t('viewButton')
    button.type = 'button'
    button.classList.add('btn', 'btn-outline-primary')
    button.setAttribute('data-bs-toggle', 'modal')
    button.setAttribute('data-bs-target', '#modal')
    button.setAttribute('data-id', post.postId)
    postLink.setAttribute('href', post.link)
    postLink.textContent = post.title
    postItem.append(postLink, button)
    posts.append(postItem)
  })
  posts.prepend(postsSectionTitle)
}

const updateUi = (state, elements, i18n) => {
  const { inputField, form, feedback, submitButton, feeds, posts } = elements

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'formState':
        if (!state[path].isValid) {
          inputField.classList.add('is-invalid')
          feedback.textContent = state[path].error
          feedback.classList.remove('text-success')
          feedback.classList.add('text-danger')
        }
        if (state[path].isValid) {
          inputField.classList.remove('is-invalid')
          feedback.textContent = ''
          feedback.classList.remove('text-danger')
        }
        break
      case 'loadingProcess':
        if (state[path].status === 'loading') {
          inputField.setAttribute('disabled', true)
          submitButton.setAttribute('disabled', true)
        }
        if (state[path].status === 'success') {
          inputField.removeAttribute('disabled')
          submitButton.removeAttribute('disabled')
          form.reset()
          inputField.focus()
          feedback.textContent = 'RSS успешно загружен'
          feedback.classList.remove('text-danger')
          feedback.classList.add('text-success')
        }
        if (state[path].status === 'failed') {
          inputField.removeAttribute('disabled')
          submitButton.removeAttribute('disabled')
          feedback.textContent = state[path].error
          feedback.classList.add('text-danger')
        }
        break
      case 'stateData.feeds': {
        feeds.textContent = ''
        const feedsSectionTitle = document.createElement('h2')
        feedsSectionTitle.textContent = i18n.t('feeds')
        feeds.append(feedsSectionTitle)
        state.stateData.feeds.forEach((feed) => {
          const feedDescription = document.createElement('p')
          feedDescription.classList.add('text-secondary')
          const feedTitle = document.createElement('b')
          feedTitle.textContent = feed.title
          feedDescription.textContent = feed.description
          feeds.append(feedTitle, feedDescription)
        })
        break
      }
      case 'stateData.posts': {
        renderPosts(posts, state, i18n)
        break
      }
      case 'ui.modal': {
        const modalTitle = document.querySelector('.modal-title')
        const modalBody = document.querySelector('.modal-body')
        const fullArticle = document.querySelector('.full-article')
        modalTitle.textContent = state.ui.modal.title
        modalBody.textContent = state.ui.modal.description
        fullArticle.href = state.ui.modal.url
        break
      }
      case 'ui.viewedPosts': {
        renderPosts(posts, state, i18n)
        break
      }
      default:
        throw new Error(`Неизвестный путь ${path}`)
    }
  })
  return watchedState
}

export default updateUi

import onChange from 'on-change';

const renderPosts = (posts, i18n) => {
  posts.textContent = '';
  const postsSectionTitle = document.createElement('h1');
  postsSectionTitle.textContent = i18n.t('posts');
  posts.appendChild(postsSectionTitle);
  watchPosts.stateData.posts.forEach((post) => {
    const postItem = document.createElement('div');
    postItem.classList.add('row');
    const linkItem = document.createElement('p');
    linkItem.classList.add('col-sm-8')
    const buttonItem = document.createElement('p');
    buttonItem.classList.add('col-sm-2')
    const postLink = document.createElement('a');
    const button = document. createElement('button');
    button.textContent = i18n.t('viewButton')
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary')
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', 'modal');
    postLink.setAttribute('href', post.link);
    postLink.textContent = post.title;
    linkItem.appendChild(postLink);
    buttonItem.appendChild(button);
    postItem.append(linkItem, buttonItem);
    posts.append(postItem);
  })
};

const updateUi = (state, inputField, feedback, button, form, feeds, posts, i18n) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
    case 'formState':
      if (!state[path].isValid) {
        inputField.classList.add('is-invalid');
        feedback.textContent = state[path].error;
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
      } 
      if (state[path].isValid) {
        inputField.classList.remove('is-invalid');
        feedback.textContent = '';
        feedback.classList.remove('text-danger');
      }
      break;
    case 'loadingProcess':   
      if (state[path].status === 'loading') {
        inputField.setAttribute('disabled', true);
        button.setAttribute('disabled', true)
      }
      if (state[path].status === 'success') {
        inputField.removeAttribute('disabled');
        button.removeAttribute('disabled');
        form.reset();
        inputField.focus();
        feedback.textContent = 'RSS успешно загружен';
        feedback.classList.remove('text-danger');
         feedback.classList.add('text-success');
      }
      if (state[path].status === 'failed') {
        inputField.removeAttribute('disabled');
        button.removeAttribute('disabled');
        feedback.textContent = state[path].error;
        feedback.classList.add('text-danger');
      }
      break;
    case 'stateData.feeds': {
      feeds.textContent = '';
      const feedsSectionTitle = document.createElement('h1');
      feedsSectionTitle.textContent = i18n.t('feeds');
      feeds.appendChild(feedsSectionTitle);
      state.stateData.feeds.forEach((feed) => {
        const feedDescription = document.createElement('p');
        feedDescription.classList.add('text-secondary');
        const feedTitle = document.createElement('b');
        feedTitle.textContent = feed.title;
        feedDescription.textContent = feed.description;
        feeds.append(feedTitle, feedDescription);
      });  
      break;
    }
    case 'stateData.posts': {
      posts.textContent = '';
      const postsSectionTitle = document.createElement('h1');
      postsSectionTitle.textContent = i18n.t('posts');
      posts.appendChild(postsSectionTitle);
      console.log(state.stateData.posts)
      state.stateData.posts.forEach((post) => {
        const postItem = document.createElement('div');
        postItem.classList.add('row');
        const linkItem = document.createElement('p');
        linkItem.classList.add('col-sm-8')
        const buttonItem = document.createElement('p');
        buttonItem.classList.add('col-sm-2')
        const postLink = document.createElement('a');
        const button = document. createElement('button');
        button.textContent = i18n.t('viewButton')
        button.type = 'button';
        button.classList.add('btn', 'btn-outline-primary')
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', 'modal');
        postLink.setAttribute('href', post.link);
        postLink.textContent = post.title;
        linkItem.appendChild(postLink);
        buttonItem.appendChild(button);
        postItem.append(linkItem, buttonItem);
        posts.append(postItem);
      });  
      break;
    }
    default: 
      throw new Error(`Неизвестный путь ${path}`);  
    }
  })
  return watchedState;
};

export default updateUi;
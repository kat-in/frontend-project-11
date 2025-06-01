import onChange from 'on-change';


const updateUi = (state, inputField, feedback, button) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'formState') {
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
    }
    if (path === 'loadingProcess') {
      if (state[path].status === 'loading') {
        inputField.setAttribute('disabled', true);
        button.setAttribute('disabled', true)
      }
      if (state[path].status === 'success') {
        inputField.setAttribute('disabled', false);
        inputField.textContent = '';
        inputField.focus();
        button.setAttribute('disabled', false);
        feedback.textContent = 'RSS успешно загружен';
        feedback.classList.add('text-success');
      }
    }
  })
  return watchedState;
};

export default updateUi;
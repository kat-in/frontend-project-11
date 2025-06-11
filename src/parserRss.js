const parseRss = (data, i18n) => {
  const parser = new DOMParser()
  const document = parser.parseFromString(data, 'text/xml')
  const parseError = document.querySelector('parsererror')
  if (parseError) {
    throw new Error(i18n.t('validation.invalidRss'))
  }
  return document
}

export default parseRss

const parseRss = (data, i18n) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/xml");
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(i18n.t('validation.invalidRss'));
  }
  return doc;
};

export default parseRss;
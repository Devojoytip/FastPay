const { translate } = require('free-translate');
const colors = require('colors');
const translateToHindi = async (s) => {
  console.log(s);
  const translatedText = await translate(s, { from: 'en', to: 'hi' });
  console.log(translatedText.green.bold);
  return translatedText;
};
module.exports = translateToHindi;
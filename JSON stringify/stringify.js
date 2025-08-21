const copyButton = document.getElementById('copy-button');
const form = document.getElementById('json-form');
const messages = document.getElementById('messages');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  clearMessages();

  const { jsobject } = getFormValues();
  const stringifiedValue = JSON.stringify(jsobject);

  navigator.clipboard.writeText(stringifiedValue);
  setMessage('Stringified value copied to clipboard');
});

function clearMessages() {
  messages.textContent = '';
}

function setMessage(m) {
  messages.textContent = m;
}

function getFormValues() {
  return [...(new FormData(form).entries())].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}




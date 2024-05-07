const copyButton = document.getElementById('copy-button');
const removeButton = document.getElementById('remove-button');
const form = document.getElementById('cookie-form');
const messages = document.getElementById('messages');

copyButton.addEventListener('click', async () => {
  const { id: name } = getFormValues();
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  clearMessages();
  
  chrome.cookies.get({
    name,
    url: new URL(tab.url).origin
  }).then((cookie) => {
    if (cookie) {
      navigator.clipboard.writeText(cookie.value);
      setMessage('Copied to clipboard');
    } else {
      setMessage('Cookie not found');
    }
  }).catch((e) => {
    setMessage('Failure :( Check logs for error');
    console.log('Cookie copy error:', e);
  })
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  clearMessages();

  const { id: name, value } = getFormValues();
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  chrome.cookies.set({
    name,
    value,
    url: new URL(tab.url).origin
  }, (cookie) => cookie ? setMessage('Cookie is set!') : setMessage('Failure :('))
});

removeButton.addEventListener('click', async () => {
  const { id: name } = getFormValues();
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  clearMessages();

  chrome.cookies.remove({
    name,
    url: new URL(tab.url).origin
  }).then(() => {
    setMessage('Cookie removed successfully');
  }).catch((e) => {
    setMessage('Failure :( Check logs for error');
    console.log('Cookie removal error:', e);
  })
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




const copyButton = document.getElementById('copy-button');
const form = document.getElementById('cookie-form');
const messages = document.getElementById('messages');

copyButton.addEventListener('click', async () => {
  const [[,name]] = new FormData(form).entries();
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  chrome.cookies.get({
    name,
    url: tab.url
  }).then((cookie) => {
    if (cookie) {
      navigator.clipboard.writeText(cookie.value);
      setMessage('Copied to clipboard');
    } else {
      setMessage('Cookie not found');
    }
  }).catch((e) => {
    setMessage('Failure :( Check logs for error');
    console.log('Cookie copy error', e);
  })
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  clearMessages();

  const [ [,name], [,value] ] = new FormData(event.target).entries();
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  chrome.cookies.set({
    name,
    value,
    url: tab.url
  }, (cookie) => cookie ? setMessage('Cookie is set!') : setMessage('Failure :('))
});

function clearMessages() {
  messages.textContent = '';
}

function setMessage(m) {
  messages.textContent = m;
}




const copyTokenButton = document.getElementById('copy-token');
const message = document.getElementById('message');
const openProxyPageButton = document.getElementById('open-via-proxy');

let localProxyPort;
const LOCAL_PROXY = 'http://localhost'
let cookieNames;
let target;


// The async IIFE is necessary because Chrome <89 does not support top level await.
async function initPopupWindow() {
  chrome.storage.sync.get({ target:'my.local', cookieNames: 'b2c_token\nb2c_refresh_token\nb2c_token_iat' }, function (configItems) {
    cookieNames = configItems.cookieNames.split('\n');
    target = configItems.target;
    console.log(cookieNames)
  })
}

document.addEventListener("DOMContentLoaded", initPopupWindow);
copyTokenButton.addEventListener('click', copyLoginToken);
openProxyPageButton.addEventListener('click', openProxyPage);


async function resolveCurrentUrl() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      return new URL(tab.url);
    } catch {
      // ignore
    }
  }
}


async function copyLoginToken(event) {
  if (event) {
    event.preventDefault();
  }
  const url = await resolveCurrentUrl();



  try {

    for (const cookieName of cookieNames) {
      const cookie = await chrome.cookies.get({ url: url.origin, name: cookieName })

      const cookieValue = cookie.value;
      chrome.cookies.set(
        { domain: target, name: cookieName, value: cookieValue, url: 'https://' + target, path: '/' }
      )
      chrome.cookies.set(
        { domain: 'localhost', name: cookieName, value: cookieValue, url: 'http://localhost', path: '/' }
      )
    }


    

  } catch (error) {
    setMessage(`Unexpected error: ${error.message}`);
  }
  setMessage(`token copied!`);
}

function setMessage(str) {
  message.textContent = str;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
  message.textContent = '';
}

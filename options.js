(function () {

    const cookieNamesInputField = document.getElementById('cookieNames');
    const targetInputField = document.getElementById('target');

    chrome.storage.sync.get({ target:'my.local', cookieNames: 'b2c_token\nb2c_refresh_token\nb2c_token_iat' }, function (configItems) {
        cookieNamesInputField.value = configItems.cookieNames;
        targetInputField.value = configItems.target;
        console.log(configItems)
    })

    const form = document.getElementById('options-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        chrome.storage.sync.set({
            cookieNames: cookieNamesInputField.value
        })
        chrome.storage.sync.set({
            target: targetInputField.value
        })
    })

})();



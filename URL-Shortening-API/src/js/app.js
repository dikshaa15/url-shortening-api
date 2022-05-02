const imgHamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation-list');
const textInput = document.querySelector('.input-text');
const InputSubmit = document.querySelector('.input-submit');
const alertUrl = document.querySelector('.alert-url');
const sectionShort = document.querySelector('.short-section-url');

imgHamburger.addEventListener('click', () => {
    navigation.classList.toggle('navigation-list-active');
})

let obj = {}

textInput.addEventListener('input', () => {
    obj['text'] = textInput.value;

    return obj;
})

InputSubmit.addEventListener('click', () => {

    const { text } = obj; //esta va a ser la url
    textInput.value = '';

    if(!validURL(text)) {
        alertUrl.classList.add('showAlert');

        setTimeout(() => {
            alertUrl.classList.remove('showAlert');
        }, 2000)
    }else {
        
        //do all the stuff
        getApi(obj['text']);
    }
})

const previous = () => {
    const initial = JSON.parse(sessionStorage.getItem('initial'));

    if(initial?.length > 0) {
        return initial;
    }else {
        return [];
    }
}


function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str); 
  }


function again() {
    const datos = previous(); // === []

    datos.forEach(item => {
        const line = document.createElement('DIV')
        line.classList.add('line')
        sectionShort.appendChild(line)

        //url-actual
        const link = document.createElement('P')
        link.classList.add('link')
        link.textContent = item.original_link;
        line.appendChild(link)

        //url-corta
        const newLink = document.createElement('A')
        newLink.classList.add('new-link')
        newLink.href = `https://${item.short_link}`;
        newLink.setAttribute('target', '_blank');   
        newLink.textContent = `https://${item.short_link}`;
        line.appendChild(newLink)

        //copy button
        const copyButton = document.createElement('BUTTON')
        copyButton.textContent = 'Copy'
        copyButton.classList.add('copy-button')
        line.appendChild(copyButton)
        copyButton.addEventListener('click', () => {
            copyToClipboard(newLink, copyButton)
        })
    })
}
again();


async function getApi(url) {
    const apiUrl = `https://api.shrtco.de/v2/shorten?url=${url}`;
    const res = await fetch(apiUrl);
    const data = await res.json()

    const result = data.result;
    const { short_link, original_link } = result;

    //linea
    const line = document.createElement('DIV')
    line.classList.add('line')
    sectionShort.appendChild(line)

    //url-actual
    const link = document.createElement('P')
    link.classList.add('link')
    link.textContent = original_link;
    line.appendChild(link)

    //url-corta
    const newLink = document.createElement('A')
    newLink.classList.add('new-link')
    newLink.href = `https://${short_link}`;
    newLink.setAttribute('target', '_blank');   
    newLink.textContent = `https://${short_link}`;
    line.appendChild(newLink)

    //copy button
    const copyButton = document.createElement('BUTTON')
    copyButton.textContent = 'Copy'
    copyButton.classList.add('copy-button')
    line.appendChild(copyButton)
    copyButton.addEventListener('click', () => {
        copyToClipboard(newLink, copyButton)
    })


    // return shortLink;
    const datos = previous(); // === []
    datos.push({short_link, original_link})
    sessionStorage.setItem('initial', JSON.stringify(datos));// ==[{short_link, original_link}]
}


function copyToClipboard(content, message) {
    navigator.clipboard.writeText(content.href)

    message.textContent = 'Copied!'
    message.classList.add('copied')

    setTimeout(() => {
        message.textContent = 'Copy'
        message.classList.remove('copied')
    }, 3000);
}

//need to refactor
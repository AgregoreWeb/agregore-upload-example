const $url = $('#url')
const $urlContainer = $('#url-container')
const $loader = $('#loader-container')
const $form = $('form')
const $fileInput = $('#file')
const $protocolSelect = $('select')

showElement($form)
hideElement($loader)

$url.onclick = () => {
  navigator.clipboard.writeText($url.innerText)
}

$form.onsubmit = async (e) => {
  e.preventDefault(true)

  showElement($loader)

  const [file] = $fileInput.files
  const { name } = file

  const protocol = $protocolSelect.value

  const isHyper = protocol === 'hyper://'

  let finalURL = null
  if (isHyper) {
    const toPut = `hyper://agregore-upload/${name}`
    console.log('Uploading', toPut)

    response = await fetch(toPut, {
      method: 'PUT',
      body: file,
      mode: 'cors'
    })

    const {headers} = response

    console.log(...headers.values())

    const link = headers.get('link')
    finalURL = link.match(/^<(.*)>/)[1]
  } else {
    const toPut = `ipfs:///${name}`

    response = await fetch(toPut, {
      method: 'POST',
      body: file,
      mode: 'cors'
    })

    finalURL = await response.text()
  }

  $url.innerText = finalURL
  showElement($urlContainer)
  hideElement($loader)
}

function $ (selector) {
  return document.querySelector(selector)
}

function showElement (element) {
  element.classList.toggle('hidden', false)
}

function hideElement (element) {
  element.classList.toggle('hidden', true)
}

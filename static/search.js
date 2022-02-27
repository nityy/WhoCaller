const numInput = document.getElementById('numinput');
const ccInput = document.getElementById('ccInput');
const resultEl = document.getElementById('result');
const searchButton = document.getElementById('searchButton');

const re = /^[0-9]{2,17}$/;

search = async function () {
  try {
    searchButton.disabled = true;
    searchButton.innerText = 'Searching...';
    if (numInput.value === '') {
      throw new Error('Input can not be empty');
    }
    if (!re.test(numInput.value)) {
      throw new Error('Input must be a number and between 2 to 17 digits long');
    }
    resultEl.innerHTML = 'Searching...';
    const response = await fetch(`/search/api?q=${numInput.value}&cc=${ccInput.value}`);
    const reply = await response.json();
    if (response.status !== 200) {
      throw new Error(reply.error);
    }
    resultEl.innerHTML =
      `<b>Query: </b>${reply.query}<br>
                    <b>Is it spam? </b>
                    <span id="spam"></span>`;
    const spamEl = document.getElementById('spam');
    if (reply.spamStatus === true) {
      spamEl.innerHTML = 'Yes';
      spamEl.style.backgroundColor = 'red';
    }
    else {
      spamEl.innerHTML = 'No';
      spamEl.style.backgroundColor = 'green';
    }
  } catch (error) {
    resultEl.innerHTML = error.message;
  } finally {
    searchButton.disabled = false;
    searchButton.innerText = 'Search';
  }
}

searchButton.onclick = search;
numInput.onkeyup = (e) => {
  if (e.key == 'Enter') {
    searchButton.click();
  }
}
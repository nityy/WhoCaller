const numInput = document.getElementById('numinput');
const resultEl = document.getElementById('result');

numInput.addEventListener('input', () => {
  numInput.setCustomValidity('');
  numInput.checkValidity();
  numInput.reportValidity();
})

numInput.addEventListener('invalid', () => {
  if (numInput.value == '') {
    numInput.setCustomValidity(' ');
  } else {
    numInput.setCustomValidity('Input should only contain digits');
  }
})

search = async function () {
  try {
    if (isNaN(numInput.value)) {
      resultEl.innerHTML = 'Query should be a number';
      return;
    }
    if (numInput.value === '') {
      resultEl.innerHTML = 'Query should not be empty';
      return;
    }
    resultEl.innerHTML = 'Searching...';
    const response = await fetch(`/search?q=${numInput.value}`);
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
    numInput.value = '';
  } catch (error) {
    resultEl.innerHTML = error.message;
  }
}

document.getElementById('button').addEventListener('click', search);
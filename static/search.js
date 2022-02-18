const numInput = document.getElementById('numinput');

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
    const resultEl = document.getElementById('result');
    if (isNaN(numInput.value)) {
      resultEl.innerHTML = 'Query should be a number';
      return;
    }
    if (numInput.value === '') {
      resultEl.innerHTML = 'Query should not be empty';
      return;
    }
    resultEl.innerHTML = 'Searching...';
    const response = await fetch('/', {
      method: 'POST', body: JSON.stringify({ query: numInput.value }), headers: { 'Content-type': 'application/json' }
    });
    const reply = await response.json();
    if (response.status !== 200) {
      throw new Error(reply.error);
    }
    resultEl.innerHTML =
      `<b>Query: </b>${reply.query}<br>
                    <b>Is it spam? </b>${reply.spamStatus}`;
    numInput.value = '';
  } catch (error) {
    document.getElementById('result').innerHTML = error.message;
  }
}

document.getElementById('button').addEventListener('click', search);
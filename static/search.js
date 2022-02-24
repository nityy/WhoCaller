const numInput = document.getElementById('numinput');
const resultEl = document.getElementById('result');

const re = /^[0-9]{2,17}$/;

search = async function () {
  try {
    if (numInput.value === '') {
      resultEl.innerHTML = 'Input can not be empty';
      return;
    }
    if (!re.test(numInput.value)) {
      resultEl.innerHTML = 'Input must be a number and between 2 to 17 digits long';
      return;
    }
    if (numInput.value === '') {
      resultEl.innerHTML = 'Input can not be empty';
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
  } catch (error) {
    resultEl.innerHTML = error.message;
  }
}

document.getElementById('button').addEventListener('click', search);
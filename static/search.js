const searchBtn = document.getElementById('searchButton');
const spamDetailsEl = document.getElementById('spamDetails');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const svgEl = document.getElementById('svg');
const statusEl = document.getElementById('status');

search = async function () {
  try {
    searchBtn.disabled = true;
    searchBtn.innerText = 'Searching...';
    resetStyles();

    const query = encodeURIComponent(document.getElementById('numinput').value);
    const cc = document.getElementById('ccInput').value

    const response = await fetch(`/search/api?q=${query}&cc=${cc}`);
    const reply = await response.json();

    if (response.status != 200 || !('message' in reply)) {
      throw new Error(reply);
    }

    displayResults(reply);
  } catch (error) {
    console.log(error);
    errorEl.classList.remove('hide');
    errorEl.textContent = error.message;
  } finally {
    searchBtn.disabled = false;
    searchBtn.innerText = 'Search';
  }
}

document.getElementById('form').onsubmit = (e) => {
  search();
  e.preventDefault();
};

const svgs = {
  notSpam: '<path fill="#79b453" d="M34.459 1.375c-1.391-.902-3.248-.506-4.149.884L13.5 28.17l-8.198-7.58c-1.217-1.125-3.114-1.051-4.239.166-1.125 1.216-1.051 3.115.166 4.239l10.764 9.952s.309.266.452.359c.504.328 1.07.484 1.63.484.982 0 1.945-.482 2.52-1.368L35.343 5.524c.902-1.39.506-3.248-.884-4.149z"/>',
  spam: '<path fill="#DD2E44" d="M18 0C8.059 0 0 8.059 0 18s8.059 18 18 18 18-8.059 18-18S27.941 0 18 0zm13 18c0 2.565-.753 4.95-2.035 6.965L11.036 7.036C13.05 5.753 15.435 5 18 5c7.18 0 13 5.821 13 13zM5 18c0-2.565.753-4.95 2.036-6.964l17.929 17.929C22.95 30.247 20.565 31 18 31c-7.179 0-13-5.82-13-13z"/>',
  notFound: '<path fill="#CCD6DD" d="M17 27c-1.657 0-3-1.343-3-3v-4c0-1.657 1.343-3 3-3 .603-.006 6-1 6-5 0-2-2-4-5-4-2.441 0-4 2-4 3 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-4.878 4.58-9 10-9 8 0 11 5.982 11 11 0 4.145-2.277 7.313-6.413 8.92-.9.351-1.79.587-2.587.747V24c0 1.657-1.343 3-3 3z"/><circle fill="#CCD6DD" cx="17" cy="32" r="3"/>'
}

function displayResults(res) {
  document.getElementById('query').textContent = res.query;
  document.getElementById('country').textContent = res.country;

  if (res.message == 'Not Found') {
    svgEl.innerHTML = svgs.notFound;
    statusEl.textContent = 'No reviews!'
  }
  if (res.spamStatus === true) {
    spamDetailsEl.classList.remove('hide');
    statusEl.textContent = 'SPAM!'
    statusEl.classList.add('font-red');
    resultEl.classList.add('border-red');
    svgEl.innerHTML = svgs.spam;
    document.getElementById('numReports').textContent = 'Reported ' +
      res.numReports + ' times';
    document.getElementById('spamCategory').textContent = res.spamCategory;
  } else if (res.spamStatus === false) {
    statusEl.textContent = 'Not spam!'
    statusEl.classList.add('font-green');
    resultEl.classList.add('border-green');
    svgEl.innerHTML = svgs.notSpam;
  }
  resultEl.classList.remove('hide');
}

function resetStyles() {
  errorEl.classList.add('hide');
  resultEl.className = 'flex hide';
  statusEl.className = 'mb8';
  spamDetailsEl.classList.add('hide');
}
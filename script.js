const inputContainer = document.getElementById('input-container');
const mergeButton = document.getElementById('merge-button');
const resultCount = document.getElementById('result-count');
const resultTextarea = document.getElementById('result');
const outputFormatSelect = document.getElementById('output-format');
const copyButton = document.getElementById('copy-button');

mergeButton.addEventListener('click', mergeWords);
inputContainer.addEventListener('input', updateResultCount);
inputContainer.addEventListener('click', handleFieldAction);
copyButton.addEventListener('click', copyToClipboard);

// Initialize with 3 input fields
for (let i = 0; i < 3; i++) {
  addField();
}

function addField() {
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';
  inputGroup.innerHTML = `
    <textarea class="input-field" placeholder="Enter words (one per line)"></textarea>
    <button class="remove-button">X</button>
  `;
  inputContainer.appendChild(inputGroup);
  updateAddFieldButton();
  updateResultCount();
}

function handleFieldAction(event) {
  if (event.target.classList.contains('add-field-button')) {
    addField();
  } else if (event.target.classList.contains('remove-button')) {
    const inputGroup = event.target.parentNode;
    inputContainer.removeChild(inputGroup);
    updateAddFieldButton();
    updateResultCount();
  }
}

function updateAddFieldButton() {
  const addFieldButton = document.querySelector('.add-field-button');
  if (addFieldButton) {
    addFieldButton.remove();
  }

  const lastInputGroup = inputContainer.lastChild;
  const newAddFieldButton = document.createElement('button');
  newAddFieldButton.className = 'add-field-button';
  newAddFieldButton.textContent = '+';
  lastInputGroup.appendChild(newAddFieldButton);
}


function removeField(event) {
  if (event.target.classList.contains('remove-button')) {
    const inputGroup = event.target.parentNode;
    inputContainer.removeChild(inputGroup);
    updateResultCount();
  }
}

function mergeWords() {
  const inputFields = document.querySelectorAll('.input-field');
  const wordArrays = Array.from(inputFields)
    .map(field => field.value.split('\n').map(word => word.trim()).filter(word => word !== ''));

  if (wordArrays.some(arr => arr.length === 0)) {
    resultTextarea.value = 'Please enter at least one word in each field.';
    copyButton.style.display = 'none';
    return;
  }

  const combinations = generateCombinations(wordArrays);
  const separator = outputFormatSelect.value === 'comma' ? ', ' : '\n';
  resultTextarea.value = combinations.join(separator);
  copyButton.style.display = 'inline-block';
}

function generateCombinations(arrays) {
  const result = [];

  function generate(current, depth) {
    if (depth === arrays.length) {
      result.push(current.join(' '));
      return;
    }

    for (let i = 0; i < arrays[depth].length; i++) {
      generate(current.concat(arrays[depth][i]), depth + 1);
    }
  }

  generate([], 0);
  return result;
}

function updateResultCount() {
  const inputFields = document.querySelectorAll('.input-field');
  const wordArrays = Array.from(inputFields)
    .map(field => field.value.split('\n').map(word => word.trim()).filter(word => word !== ''));

  const combinationCount = wordArrays.reduce((count, words) => count * words.length, 1);
  resultCount.textContent = combinationCount;
}

function copyToClipboard() {
  resultTextarea.select();
  document.execCommand('copy');
  alert('Output copied to clipboard!');
}
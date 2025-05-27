const input = document.querySelector('input');
const btn = document.querySelector('button');
const dictionary = document.querySelector('.dictionary-app');
const errorMessage = document.createElement('div'); // Create a div for error messages
errorMessage.style.color = 'red'; // Style the error message text

// Append errorMessage div to the container
document.querySelector('.container').appendChild(errorMessage);

// Fetching the dictionary data from API
async function dictionaryFn(word) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => res.json());
    return res[0];
}

btn.addEventListener('click', fetchandCreateCard);

async function fetchandCreateCard() {
    // Trim the input to remove leading and trailing spaces
    const searchWord = input.value.trim();

    // Clear any previous error messages
    errorMessage.textContent = '';

    // Check if the input is empty
    if (!searchWord) {
        errorMessage.textContent = 'Please enter a word.';
        dictionary.innerHTML = ''; // Clear any previous search results
        return;
    }

    // Check for invalid characters (you can customize this regex)
    const invalidChars = /[^a-zA-Z]/; // Only allow letters (no numbers, special characters)
    if (invalidChars.test(searchWord)) {
        errorMessage.textContent = 'Please enter a valid word (letters only).';
        dictionary.innerHTML = ''; // Clear any previous search results
        return;
    }

    try {
        // Attempt to fetch data from the API
        const data = await dictionaryFn(searchWord);
        if (!data) {
            // If no data returned (e.g., word not found)
            errorMessage.textContent = 'Word not found in the dictionary.';
            dictionary.innerHTML = ''; // Clear any previous search results
            return;
        }

        let partOfSpeechArray = [];
        for (let i = 0; i < data.meanings.length; i++) {
            partOfSpeechArray.push(data.meanings[i].partOfSpeech);
        }

        // Display the fetched data
        dictionary.innerHTML = `
            <div class="card">
                <div class="property">
                    <span>Word :</span>
                    <span>${data.word}</span>
                </div>

                <div class="property">
                    <span>Phonetics :</span>
                    <span>${data.phonetic || 'No phonetic available'}</span>
                </div>

                <div class="property">
                    <span>
                        ${data.phonetics?.[0]?.audio ? `<audio controls src="${data.phonetics[0].audio}"></audio>` : 'No audio available'}
                    </span>
                </div>

                <div class="property">
                    <span>Definition :</span>
                    <span>${data.meanings[0].definitions[0].definition}</span>
                </div>

                <div class="property">
                    <span>Example :</span>
                    <span>${data.meanings[1]?.definitions[0]?.example || 'No example available'}</span>
                </div>

                <div class="property">
                    <span>${partOfSpeechArray.map(e => e).join(' , ')}</span>
                </div>
            </div>
        `;
    } catch (error) {
        // Handle any other errors, like network issues
        errorMessage.textContent = 'Sorry, there was an error fetching the data.';
        dictionary.innerHTML = ''; // Clear any previous search results
    }
}

const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search-bar')
const filterDiv = document.getElementById('filter-list-window')
const filterButtons = document.querySelectorAll('.filter-button');
const resetButton = document.getElementById('reset-button');
const applyButton = document.getElementById('apply-button');

let limit = 20;
let i = 0;

let pokemonNames = []

// Searchbar code
searchInput.addEventListener("input", (e) => {
    const searchString = e.target.value

    const filteredPokemons = pokemonNames.filter((pokemon) => {
        return (
            pokemon.name.toLowerCase().includes(searchString)
        );

    })
    if (filteredPokemons.length === 0) {
        displayNoResultsMessage();
    } else {
        removeNoResultsMessage();
        displayPokemon(filteredPokemons);
    }

})

// Function that creates no results message in searchbar
function displayNoResultsMessage() {
    removePreviousResults();

    const noResultsMessageContainer = document.createElement('div');
    noResultsMessageContainer.classList.add('no-results-container');

    const noResultsImage = document.createElement('img');
    noResultsImage.src = "/images/no-result-img.png";
    noResultsImage.alt = "Nie znaleziono pokemonów o podanej nazwie";

    const noResultsText = document.createElement('p');
    noResultsText.textContent = 'Nie znaleziono pokemonów o podanej nazwie';

    noResultsMessageContainer.appendChild(noResultsImage);
    noResultsMessageContainer.appendChild(noResultsText);

    pokedex.appendChild(noResultsMessageContainer);

}

// Function that removes precious results
function removePreviousResults() {
    removeNoResultsMessage();

    const previousResults = document.querySelectorAll(".card");
    previousResults.forEach((result) => result.remove());
}

// Function that removes "no result" message
function removeNoResultsMessage() {
    const noResultsMessageContainer = document.querySelector('.no-results-container');
    if (noResultsMessageContainer) {
        noResultsMessageContainer.remove();
    }
}

// Fetching pokemons
const fetchPokemons = async () => {
    const getPokemon = async id => {
        try {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`
            const res = await fetch(url);
            pokemonNames = await res.json();
            return pokemonNames;
        } catch (err) {
            console.error(err);
        }
    }

    const promises = [];
    for (let i = 1; i <= limit; i++) {
        promises.push(getPokemon(i))
    }
    i += 20;
    limit +=20;

// Function that map through API properties

    const results = await Promise.all(promises);
    const pokemon = results.map((result) => ({
        name: result.name,
        image: result.sprites['front_default'],
        type: result.types.map((type) => type.type.name).join('\n'),
        id: String(result.id).padStart(4, '0')
    }));
    pokemonNames = pokemon.map((p) => ({
        name: p.name, image: p.image, type: p.type, id: p.id

    }));
    displayPokemon(pokemon)
}

// Function that create pokemons card

const displayPokemon = (pokemon) => {

    const pokemonHTMLString = pokemon
        .map(
            (pokemon) => `
        <li class="card">
            <div class="card-image-wrapper">
                <img class="card-image" src="${pokemon.image}"/>
            </div>
            <div class="card-id-wrapper">
                <h3 class="card-id">#${pokemon.id}</h3>
            </div>
            <h2 class="card-title">${pokemon.name}</h2>
            <div class="card-subtitle-wrapper">
                <p class="card-subtitle">${pokemon.type}</p>
            </div>
           
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString
}


// Filtr option in searchbar
let isClicked = true;
let showOrHide = () => {
    if (isClicked) {
        filterDiv.style.display = 'block';
        isClicked = false;
    } else {
        filterDiv.style.display = 'none';
        isClicked = true;
    }
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedType = button.dataset.type; // Pobieranie wybranego typu

        // Filtruj pokemony na podstawie wybranego typu
        const filteredPokemons = pokemonNames.filter((pokemon) => {
            return pokemon.type.includes(selectedType);
        });

        // Wyświetl wynik filtrowania
        displayPokemon(filteredPokemons);
    });


});

// Apply and Reset buttons functionality
resetButton.addEventListener('click', () => {

    filterButtons.forEach((btn) => {
        btn.classList.remove('selected');
    });
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {

        const selectedButton = document.querySelector('.filter-button.selected');
        if (selectedButton) {
            selectedButton.classList.remove('selected');
        }


        button.classList.add('selected');
    });
});


fetchPokemons();






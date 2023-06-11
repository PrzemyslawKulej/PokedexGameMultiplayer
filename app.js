const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search-bar')

const filterIcon = document.getElementById('filter-icon');
const filterDiv = document.getElementById('filter-list-window')
const filterButtons = document.querySelectorAll('.filter-button');
const filterButtonsContainer = document.getElementById('type-buttons-container')

const resetButton = document.getElementById('reset-button');
const applyButton = document.getElementById('apply-button');

const cards = document.querySelectorAll('.card');


let limit = 20;
let i = 0;

// Variable storing type of pokemon
let selectedFilter = null;

let pokemonNames = []

// Object with type colors

const commonBadgeStyle =
    "    height: 20px;\n" +
    "    border: none;\n" +
    "    border-radius: 5px;\n" +
    "    font-size: 16px;\n" +
    "    width: 90px;\n" +
    "    margin-top: 15px;\n" +
    "    margin-left: 4px;\n" +
    "    margin-right: 4px;\n" +
    "    color: white;";


const pokemonTypeStyles = {
    normal: `background-color: #A8A77A; ${commonBadgeStyle}`,
    fighting: `background-color: #C22E28; ${commonBadgeStyle}`,
    flying: `background-color: #A98FF3; ${commonBadgeStyle}`,
    poison: `background-color: #A33EA1; ${commonBadgeStyle}`,
    ground: `background-color: #E2BF65; ${commonBadgeStyle}`,
    rock: `background-color: #B6A136; ${commonBadgeStyle}`,
    bug: `background-color: #A6B91A; ${commonBadgeStyle}`,
    ghost: `background-color: #735797; ${commonBadgeStyle}`,
    steel: `background-color: #B7B7CE; ${commonBadgeStyle}`,
    fire: `background-color: #EE8130; ${commonBadgeStyle}`,
    water: `background-color: #6390F0; ${commonBadgeStyle}`,
    grass: `background-color: #7AC74C; ${commonBadgeStyle}`,
    electric: `background-color: #F7D02C; ${commonBadgeStyle}`,
    psychic: `background-color: #F95587; ${commonBadgeStyle}`,
    ice: `background-color: #96D9D6; ${commonBadgeStyle}`,
    dragon: `background-color: #6F35FC; ${commonBadgeStyle}`,
    dark: `background-color: #705746; ${commonBadgeStyle}`,
    fairy: `background-color: #D685AD; ${commonBadgeStyle}`,
    unknown: `background-color: #B3B3B3; ${commonBadgeStyle}`,
    shadow: `background-color: #3C3C44; ${commonBadgeStyle}`,
};


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

// Function that removes previous results
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
        type: result.types.map((type) => type.type.name),
        id: result.id,
        displayId: String(result.id).padStart(4, '0')
    }));
    pokemonNames = pokemon.map((p) => ({
        name: p.name, image: p.image, type: p.type, id: p.id, displayId: p.displayId

    }));
    // If a filter is selected, apply it
    if (selectedFilter) {
        const filteredPokemons = pokemonNames.filter((pokemon) => {
            return pokemon.type.includes(selectedFilter);
        });
        displayPokemon(filteredPokemons);
    } else {
        displayPokemon(pokemonNames);
    }


        const cards = document.querySelectorAll('.flip-container');
        cards.forEach(card => {
            card.addEventListener('click', flipCard);
        });


}




// Function that create pokemons cards

const displayPokemon = (pokemon) => {

    const pokemonHTMLString = pokemon
        .map(
            (pokemon) => `
                <li class="card">
                    <div class="flip-card" data-id="${pokemon.id}">
                        <div class="flip-card-inner">
                            <div class="flip-container">
                                <div class="flip-card-front">
                                    <div class="card-image-wrapper">
                                        <img class="card-image" src="${pokemon.image}"/>
                                    </div>
                                    <div class="card-id-wrapper">
                                        <h3 class="card-id">#${pokemon.displayId}</h3>
                                    </div>
                                    <h2 class="card-title">${pokemon.name}</h2>
                                    <div class="card-subtitle-wrapper">
                                        ${pokemon.type.map(type => `<span class="card-subtitle" style="${pokemonTypeStyles[type]}">${type}</span>`).join('')}
                                    </div>
                                </div>
                                <div class="flip-card-back">
                                    <!-- Tu można dodać dodatkowe informacje, które mają się pokazać po całkowitym obrocie karty -->
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString
}


// Function that fetch types to searchbar filter

async function fetchTypes() {
    try {
        const url = 'https://pokeapi.co/api/v2/type'
        const res = await fetch(url);
        const types = await res.json();
        return types.results;
    } catch (err) {
        console.error(err);
    }
}

// Function that generate buttons in searchbar filter


let pendingFilter = null;  // Nowa zmienna przechowująca filtr do momentu naciśnięcia Apply

async function generateFilterButtons() {
    const types = await fetchTypes();

    types.forEach((type) => {
        const button = document.createElement('button');
        button.classList.add('filter-button-style');
        button.textContent = type.name;
        button.dataset.type = type.name;
        button.style = pokemonTypeStyles[type.name];

        button.addEventListener('click', (event) => {
            const currentSelectedButton = filterDiv.querySelector('.filter-button-style.selected');
            if (currentSelectedButton) {
                currentSelectedButton.classList.remove('selected');
            }

            button.classList.add('selected');
            pendingFilter = button.dataset.type;  // Zapisujemy filtr do pendingFilter, ale nie stosujemy go od razu
        });

        filterButtonsContainer.appendChild(button);
    });
}


generateFilterButtons();




// Filtr option in searchbar
let isClicked = true;
filterIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // stop the event from bubbling up to the document
    if (filterDiv.style.display === 'none' || filterDiv.style.display === '') {
        filterDiv.style.display = 'block';
    } else {
        filterDiv.style.display = 'none';
    }
});

filterDiv.addEventListener('click', (event) => {
    event.stopPropagation(); // stop the event from bubbling up to the document
});

document.addEventListener('click', function() {
    // When we click outside the filterDiv or filter icon, we hide filterDiv
    filterDiv.style.display = 'none';

});

// Apply and Reset buttons functionality

//  Removing type after reset click
resetButton.addEventListener('click', () => {
    const allButtons = document.querySelectorAll('.filter-button-style');
    allButtons.forEach((btn) => {
        btn.classList.remove('selected');
    });

    // Reset selected filter
    selectedFilter = null;

    // Restore full pokemon lists
    displayPokemon(pokemonNames);
});

applyButton.addEventListener('click', () => {
    // Dopiero po naciśnięciu przycisku 'apply' stosujemy filtr
    selectedFilter = pendingFilter;
    if (selectedFilter) {
        const filteredPokemons = pokemonNames.filter((pokemon) => {
            return pokemon.type.includes(selectedFilter);
        });
        displayPokemon(filteredPokemons);
    }
});
document.addEventListener('click', function(event) {
    let isClickInsideElement = filterDiv.contains(event.target);

    if (!isClickInsideElement) {
        if (selectedFilter) {
            const filteredPokemons = pokemonNames.filter((pokemon) => {
                return pokemon.type.includes(selectedFilter);
            });
            displayPokemon(filteredPokemons);
        }
    }
});

// Rotating the card


const fetchPokemonDetails = async (id) => {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`
        const res = await fetch(url);
        const details = await res.json();
        return details;
    } catch (err) {
        console.error(err);
    }
}

async function flipCard() {
    console.log("flipCard called")
    this.classList.add('flipped');

    const id = this.closest('.flip-card').dataset.id;
    const pokemonDetails = await fetchPokemonDetails(id);

    const cardBack = this.querySelector('.flip-card-back');
    cardBack.innerHTML = `
        <h3>Stats</h3>
        ${pokemonDetails.stats.map(stat => `<p>${stat.stat.name}: ${stat.base_stat}</p>`).join('')}
    `;
}


fetchPokemons();

// comma
// comma






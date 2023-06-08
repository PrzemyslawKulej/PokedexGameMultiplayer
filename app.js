const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search-bar')
const filterIcon = document.getElementById('filter-icon');
const filterDiv = document.getElementById('filter-list-window')
const filterButtons = document.querySelectorAll('.filter-button');
const filterButtonsContainer = document.getElementById('type-buttons-container')
const resetButton = document.getElementById('reset-button');
const applyButton = document.getElementById('apply-button');


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
    "    width: 80px;\n" +
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
        id: String(result.id).padStart(4, '0')
    }));
    pokemonNames = pokemon.map((p) => ({
        name: p.name, image: p.image, type: p.type, id: p.id

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
}




// Function that create pokemons cards

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
            ${pokemon.type.map(type => `<span class="card-subtitle" style="${pokemonTypeStyles[type]}">${type}</span>`).join('')}
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


async function generateFilterButtons() {
    const types = await fetchTypes();

    types.forEach((type) => {
        const button = document.createElement('button');
        button.classList.add('filter-button');
        button.textContent = type.name;
        button.dataset.type = type.name;

        button.addEventListener('click', (event) => {
            const currentSelectedButton = filterDiv.querySelector('.filter-button.selected');
            if (currentSelectedButton) {
                currentSelectedButton.classList.remove('selected');
            }

            button.classList.add('selected');
            selectedFilter = button.dataset.type;
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



// Taking selected type
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedType = button.dataset.type;

        // Filter Pokemon based on the selected type
        const filteredPokemons = pokemonNames.filter((pokemon) => {
            return pokemon.type.includes(selectedType);
        });

        // Show filter results
        displayPokemon(filteredPokemons);
    });


});

// Apply and Reset buttons functionality

//  Removing type after reset click
resetButton.addEventListener('click', () => {
    // Znajdź wszystkie przyciski i usuń z nich klasę 'selected'
    const allButtons = document.querySelectorAll('.filter-button');
    allButtons.forEach((btn) => {
        btn.classList.remove('selected');
    });

    // Reset selected filter
    selectedFilter = null;

    // Restore full pokemon lists
    displayPokemon(pokemonNames);
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {

        const selectedButton = document.querySelector('.filter-button.selected');
        if (selectedButton) {
            selectedButton.classList.remove('selected');
        }


        button.classList.add('selected');
        selectedFilter = button.dataset.type;
    });
});

applyButton.addEventListener('click', () => {
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


fetchPokemons();

// comma






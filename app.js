const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search-bar')

let limit = 20;
let i = 0;

let pokemonNames = []

searchInput.addEventListener("input", (e) => {
    const searchString = e.target.value

    const filteredPokemons = pokemonNames.filter((pokemon) => {
        return (
            pokemon.name.toLowerCase().includes(searchString)
        );
    })
    displayPokemon(filteredPokemons);
})


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



    const results = await Promise.all(promises);
    const pokemon = results.map((result) => ({
        name: result.name,
        image: result.sprites['front_default'],
        type: result.types.map((type) => type.type.name),
        id: result.id
    }));
    pokemonNames = pokemon.map((p) => ({
        name: p.name, image: p.image, type: p.type, id: p.id

    }));
    displayPokemon(pokemon)
}


const displayPokemon = (pokemon) => {

    const pokemonHTMLString = pokemon
        .map(
            (pokemon) => `
        <li class="card">
            <img class="card-image" src="${pokemon.image}"/>
            <h2 class="card-title">${pokemon.name}</h2>
            <p class="card-subtitle">Type: ${pokemon.type}</p>
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString
}

fetchPokemons();




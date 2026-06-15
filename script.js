const API_URL = 'https://pokeapi.co/api/v2/pokemon';
let currentPokemonId = 1;
let totalPokemons = 1025;

const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    pokemonCard: document.getElementById('pokemonCard'),
    pokemonImage: document.getElementById('pokemonImage'),
    pokemonName: document.getElementById('pokemonName'),
    pokemonId: document.getElementById('pokemonId'),
    pokemonTypes: document.getElementById('pokemonTypes'),
    statsContainer: document.getElementById('statsContainer'),
    abilitiesContainer: document.getElementById('abilitiesContainer'),
    height: document.getElementById('height'),
    weight: document.getElementById('weight'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    navigationInfo: document.getElementById('navigationInfo'),
    errorMessage: document.getElementById('errorMessage'),
    loadingSpinner: document.getElementById('loadingSpinner'),
};

async function fetchPokemon(query) {
    try {
        showLoading(true);
        hideError();

        const url = `${API_URL}/${String(query).toLowerCase()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }

        const data = await response.json();
        displayPokemon(data);
        currentPokemonId = data.id;

    } catch (error) {
        showError(error.message);
        hidePokemonCard();
    } finally {
        showLoading(false);
    }
}

function displayPokemon(pokemon) {
    const name = pokemon.name;
    const id = pokemon.id;
    const image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    const types = pokemon.types;
    const stats = pokemon.stats;
    const abilities = pokemon.abilities;
    const height = (pokemon.height / 10).toFixed(1);
    const weight = (pokemon.weight / 10).toFixed(1);

    elements.pokemonName.textContent = name;
    elements.pokemonId.textContent = `#${String(id).padStart(3, '0')}`;
    elements.pokemonImage.src = image;
    elements.pokemonImage.alt = name;

    displayTypes(types);
    displayStats(stats);
    displayAbilities(abilities);

    elements.height.textContent = `${height} m`;
    elements.weight.textContent = `${weight} kg`;
    elements.navigationInfo.textContent = `${id} / ${totalPokemons}`;

    updateNavigationButtons();
    showPokemonCard();
}

function displayTypes(types) {
    elements.pokemonTypes.innerHTML = '';

    types.forEach(typeObj => {
        const typeName = typeObj.type.name;
        const badge = document.createElement('span');
        badge.className = `type-badge type-${typeName}`;
        badge.textContent = typeName;
        elements.pokemonTypes.appendChild(badge);
    });
}

function displayStats(stats) {
    elements.statsContainer.innerHTML = '';

    stats.forEach(statObj => {
        const statName = statObj.stat.name;
        const baseStat = statObj.base_stat;
        const percentage = Math.min((baseStat / 150) * 100, 100);

        const statItem = document.createElement('div');
        statItem.className = 'stat-item';

        const label = document.createElement('div');
        label.className = 'stat-label';
        label.textContent = statName.replace('-', ' ');

        const value = document.createElement('div');
        value.className = 'stat-value';
        value.textContent = baseStat;

        const barContainer = document.createElement('div');
        barContainer.className = 'stat-bar';

        const bar = document.createElement('div');
        bar.className = 'stat-fill';
        bar.style.width = percentage + '%';

        barContainer.appendChild(bar);
        statItem.appendChild(label);
        statItem.appendChild(value);
        statItem.appendChild(barContainer);

        elements.statsContainer.appendChild(statItem);
    });
}

function displayAbilities(abilities) {
    elements.abilitiesContainer.innerHTML = '';

    const validAbilities = abilities.slice(0, 3);

    validAbilities.forEach(abilityObj => {
        const abilityName = abilityObj.ability.name;
        const isHidden = abilityObj.is_hidden ? ' (Oculta)' : '';

        const abilityItem = document.createElement('div');
        abilityItem.className = 'ability-item';
        abilityItem.textContent = abilityName + isHidden;

        elements.abilitiesContainer.appendChild(abilityItem);
    });
}

function updateNavigationButtons() {
    elements.prevBtn.disabled = currentPokemonId <= 1;
    elements.nextBtn.disabled = currentPokemonId >= totalPokemons;
}

function showPokemonCard() {
    elements.pokemonCard.classList.remove('hidden');
}

function hidePokemonCard() {
    elements.pokemonCard.classList.add('hidden');
}

function showLoading(show) {
    if (show) {
        elements.loadingSpinner.classList.remove('hidden');
    } else {
        elements.loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.add('show');
}

function hideError() {
    elements.errorMessage.classList.remove('show');
}

elements.searchBtn.addEventListener('click', () => {
    const query = elements.searchInput.value.trim();
    if (query) {
        fetchPokemon(query);
    } else {
        showError('Digite um nome ou número de Pokémon');
    }
});

elements.searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        elements.searchBtn.click();
    }
});

elements.prevBtn.addEventListener('click', () => {
    if (currentPokemonId > 1) {
        fetchPokemon(currentPokemonId - 1);
    }
});

elements.nextBtn.addEventListener('click', () => {
    if (currentPokemonId < totalPokemons) {
        fetchPokemon(currentPokemonId + 1);
    }
});

window.addEventListener('load', () => {
    fetchPokemon(1);
});

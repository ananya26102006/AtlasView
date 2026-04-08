const countriesContainer = document.getElementById("countries-container");
const loading = document.getElementById("loading");

const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const sortOption = document.getElementById("sortOption");
const themeToggle = document.getElementById("themeToggle");

let allCountries = [];

async function fetchCountries() {
    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags"
        );

        const countries = await response.json();

        allCountries = countries;

        displayCountries(allCountries);

        loading.style.display = "none";

    } catch (error) {
        loading.textContent = "Error loading countries!";
        console.error(error);
    }
}

function displayCountries(countries) {
    countriesContainer.innerHTML = "";

    countries.forEach(country => {
        const card = document.createElement("div");

        card.classList.add("country-card");

        card.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}">
            <div class="country-info">
                <h3>${country.name.common}</h3>
                <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            </div>
        `;

        countriesContainer.appendChild(card);
    });
}

function applyFilters() {
    let filteredCountries = [...allCountries];

    // SEARCH
    filteredCountries = filteredCountries.filter(country =>
        country.name.common.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    // REGION FILTER
    if (regionFilter.value !== "all") {
        filteredCountries = filteredCountries.filter(country =>
            country.region === regionFilter.value
        );
    }

    // SORT
    if (sortOption.value === "nameAsc") {
        filteredCountries.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );
    }

    if (sortOption.value === "populationAsc") {
        filteredCountries.sort((a, b) =>
            a.population - b.population
        );
    }

    if (sortOption.value === "populationDesc") {
        filteredCountries.sort((a, b) =>
            b.population - a.population
        );
    }

    displayCountries(filteredCountries);
}

searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);
sortOption.addEventListener("change", applyFilters);

// DARK MODE
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

fetchCountries();
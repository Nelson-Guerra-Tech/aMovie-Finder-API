//TMDB API Logic
//var and const to hold the API key, base url, and api url.
var API_KEY = 'api_key=f0897d972ac193475a6d2b4188ebe126';
const BASE_URL = 'https://api.themoviedb.org/3';
//constructing the entire URL as a whole
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
//constructing the entire URL for movie images
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

//variable that holds all genres
const genre = [{
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

//const variable to hold the value of main from index.html
const main = document.getElementById('main');
//const variable to hold the value of form from index.html
const form = document.getElementById('form');
//const variable to hold the value of search from index.html
const search = document.getElementById('search');
//const variable to hold the value of tags div from index.html
const tagsElement = document.getElementById('tags');
//let variable to hold the value of genres when clicked from index.html
let selectedGenre = [];

//creating function for displaying genres on website
setGenre();

function setGenre() {
    tagsElement.innerHTML = '';
    genre.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length === 0) {
                selectedGenre.push(genre.id);
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id === genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        tagsElement.append(t);
    })
}

//function to highlight selection of genre
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn();
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
}


//calling the getMovies function by using the API_URL
getMovies(API_URL);


//function to call an API from the source
function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {

        console.log(data.results);
        if (data.results.length !== 0) {
            showMovies(data.results);
        } else {
            main.innerHTML = '<h2 style="color: #fff">No Results Found</h2>'
        }

    })
}

//clears the screen
function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight');
    } else {

        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerHTML = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsElement.append(clear);
    }
}

//a funcion to loop through all of the data on the API
function showMovies(data) {
    //this will show a blank screen until something is fetched
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `

        <img class="hvr-float" src="${poster_path? IMG_URL + poster_path: "/img/jakob-owens-CiUR8zISX60-unsplash.jpg"}" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>

        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>

        `

        main.appendChild(movieElement);
    })

}

//function that adds a different color depending on the movie rating
function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

//event listener for clicking enter
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = [];
    highlightSelection();
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    }

});
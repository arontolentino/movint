console.log('Index.js is connected!');

$(document).ready(function() {
	let searchTerm = '';
	let searchQuery = '';
	let searchResults = [];
	let resultsPage = 1;
	const API_KEY = '478d3d02be8a73d3dd340c0d5dff612d';

	// Event listeners
	$('#searchBtn').on('click', getSearchResults);
	$('#searchTerm').on('keyup', function(e) {
		if (e.keyCode === 13) {
			getSearchResults();
		}
	});

	$(document).on('click', 'a#learnMore', function(e) {
		let id = e.target.attributes['data-id'].value;
		showMovieDetail(id);
	});

	$('.modal-close').on('click', hideMovieDetail);

	$('#loadMore').on('click', function() {
		console.log(resultsPage);
		loadMoreResults();
		console.log(resultsPage);
	});

	// API Call to TMDB for search query
	async function getSearchResults() {
		searchResults = [];
		resultsPage = 1;
		searchTerm = $('#searchTerm').val();
		searchQuery = searchTerm.replace(' ', '+');

		console.log(searchTerm);

		$('#searchResults').empty();

		try {
			let apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${resultsPage}`;

			console.log(apiURL);

			let response = await $.ajax(apiURL);
			console.log(response);
			response.results.map(result => searchResults.push(result));
			resultsPage++;

			if (resultsPage > response.total_pages) {
				$('#loadMore').remove();
			}

			displaySearchResults(response.results);
		} catch (err) {
			console.log(err);
		}
	}

	async function loadMoreResults() {
		let searchQuery = searchTerm.replace(' ', '+');

		try {
			let apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${resultsPage}`;

			console.log(apiURL);

			let response = await $.ajax(apiURL);
			console.log(response);

			displaySearchResults(response.results);

			response.results.map(result => {
				searchResults.push(result);
			});
			resultsPage++;

			if (resultsPage > response.total_pages) {
				$('#loadMore').remove();
			}
		} catch (err) {
			console.log(err);
		}
	}

	function showMovieDetail(id) {
		$('.modal').addClass('is-active');
		$('.modal-content').append(`<h1>${id}</h1>`);
	}

	function hideMovieDetail() {
		$('.modal').removeClass('is-active');
		$('.modal-content').empty();
	}

	// Update UI for search results
	function displaySearchResults(results) {
		results.map(result => {
			$('#searchResults').append(
				`
        <!-- Movie Entry-->
        <div class="column is-one-quarter" id="searchResult">
          <div class="card">
            <div class="card-image">
              <figure class="image is-2by3">
                <img
                  src=${`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="content issmall">
                <h3 class="title is-5">${result.title}</h3>
                <h4 class="subtitle is-6">${moment(result.release_date).format(
									'MMMM D, YYYY'
								)}</h4>
                <h4 class="subtitle is-6">${`Average Rating: ${result.vote_average}`}</h4>
                <p class="is-size-6">${`${result.overview.slice(
									0,
									130
								)}...`}</p>
              </div>
            </div>
            <footer class="card-footer">
              <a class="card-footer-item" id="learnMore" data-id="${
								result.id
							}">Learn More</a>
            </footer>
          </div>
        </div>
        `
			);
		});
	}
});

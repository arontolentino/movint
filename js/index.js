console.log('Index.js is connected!');

$(document).ready(function() {
	let searchResults;

	// Event listeners
	$('#searchBtn').on('click', getSearchResults);
	$('#searchTerm').on('keyup', function(e) {
		if (e.keyCode === 13) {
			getSearchResults();
		}
	});

	// API Call to TMDB for search query
	async function getSearchResults() {
		let searchTerm = $('#searchTerm').val();
		let searchQuery = searchTerm.replace(' ', '+');
		const API_KEY = '478d3d02be8a73d3dd340c0d5dff612d';

		try {
			const response = await $.ajax(
				`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`
			);
			searchResults = response;
			displaySearchResults(response);
		} catch (err) {
			console.log(err);
		}
	}

	// Update UI for search results
	function displaySearchResults(response) {
		$('#searchResults').empty();

		response.results.map(result => {
			console.log(result);
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
              <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                <a href="#">#css</a>
                <a href="#">#responsive</a>
                <br />
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
              </div>
            </div>
          </div>
        </div>
        `
			);
		});
	}
});

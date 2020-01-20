$(document).ready(function() {
	const movintApp = {
		searchTerm: '',
		searchQuery: '',
		searchResults: [],
		resultsPage: 1,

		IMG_PLACEHOLDER: 'src/img/image-placeholder.png',
		API_KEY: '478d3d02be8a73d3dd340c0d5dff612d',

		sendAPIRequest: async function() {
			this.searchTerm = $('#searchTerm').val();
			this.searchQuery = this.searchTerm.replace(' ', '+');

			try {
				let apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&query=${this.searchQuery}&page=${this.resultsPage}`;

				let response = await $.ajax(apiURL);
				response.results.map(result => this.searchResults.push(result));
				$('#loadMore').show();
				this.resultsPage++;

				if (this.resultsPage > response.total_pages) {
					$('#loadMore').remove();
				}

				this.displaySearchResults(response.results);
			} catch (err) {
				console.log(err);
			}
		},

		// Get movie list based on search query
		getSearchResults: function() {
			$('#searchResults').empty();
			this.resultsPage = 1;
			movintApp.sendAPIRequest();
		},

		loadMoreResults: function() {
			movintApp.sendAPIRequest();
		},

		// Update UI for search results
		displaySearchResults: function(results) {
			results.map(result => {
				let posterImg =
					result.poster_path === null
						? this.IMG_PLACEHOLDER
						: `https://image.tmdb.org/t/p/w500/${result.poster_path}`;

				$('#searchResults').append(
					`
          <!-- Movie Entry-->
          <div class="column is-one-quarter" id="searchResult">
            <div class="card">
              <div class="card-image">
                <figure class="image is-2by3">
                  <img
                    src=${posterImg}
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div class="card-content">
                <div class="content issmall">
                  <h3 class="title is-5">${result.title}</h3>
                  <h4 class="subtitle is-6">${moment(
										result.release_date
									).format('MMMM D, YYYY')}</h4>
                  <h4 class="subtitle is-6">Average Rating: ${
										result.vote_average
									}</h4>
                  <p class="is-size-6">${result.overview.slice(0, 130)}...</p>
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
		},

		// Get more details about selected movie based on ID
		getMovieDetail: async function(id) {
			try {
				let movieDetailURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.API_KEY}&language=en-US`;

				let movieDetails = await $.ajax(movieDetailURL);
				this.showMovieDetail(movieDetails);
			} catch (err) {
				console.log(err);
			}
		},

		// Trigger modal component and append content to modal
		showMovieDetail: function(movieDetails) {
			let posterImg =
				movieDetails.poster_path === null
					? this.IMG_PLACEHOLDER
					: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`;

			$('.modal').addClass('is-active');
			$('.modal').append(
				`
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">${movieDetails.original_title}</p>
              <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
              <div class="content">
                <div class="columns">
                  <div class="column is-half">
                    <div class="image is-2by3">
                      <img
                      src=${posterImg}
                      />
                    </div>
                  </div>
                  <div class="column">
                    <div class="tags are-medium">
                      <span class="tag">All</span>
                      <span class="tag">Medium</span>
                      <span class="tag">Size</span>
                    </div>
                    <div class="ratings">
                      <h4>Rating: ${movieDetails.vote_average}/10</h4>
                      <progress class="progress is-primary" value="${movieDetails.vote_average}" max="10">15%</progress>
                    </div>
                    <div class="overview">
                      <h4>Overview</h4>
                      <p>${movieDetails.overview}</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </section>
          </div>
        `
			);
		},

		// Close modal content
		hideMovieDetail: function() {
			$('.modal').removeClass('is-active');
			$('.modal').empty();
		}
	};

	$('#searchBtn').on('click', movintApp.getSearchResults);
	$('#searchTerm').on('keyup', function(e) {
		if (e.keyCode === 13) {
			movintApp.getSearchResults();
		}
	});

	$(document).on('click', 'a#learnMore', function(e) {
		let id = e.target.attributes['data-id'].value;
		movintApp.getMovieDetail(id);
	});

	$(document).on('click', '.delete', movintApp.hideMovieDetail);

	$('#loadMore').on('click', function() {
		movintApp.loadMoreResults();
	});
});

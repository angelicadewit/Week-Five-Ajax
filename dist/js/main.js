'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {

	var API_KEY = "U5rQPUaVIkcyszlF6HT43gOJKsl9C2Riq0hFHAGt9nWm6eVQiZdIn39X1Un0wu-5QuTpG43jdXTPT2kEh0lyFQdv4Nkdv3uZJP-kurKrCo7z1xXNlpMaLAgYTGPiWnYx";

	var termEl = document.getElementById('term');
	var locationEl = document.getElementById('location');
	var searchBtn = document.getElementById('search');
	var resultsEl = document.getElementById('results');

	searchBtn.addEventListener('click', function (e) {
		e.preventDefault();
		var queryTerm = termEl.value;
		var location = locationEl.value;
		var prices = getCheckedValues(document.querySelectorAll('[name=price]:checked'));
		searchYelp(location, queryTerm, prices);
	});

	var searchYelp = function searchYelp(location, queryTerm, prices) {
		axios.get('https://circuslabs.net/proxies/yelp-fusion-proxy/', {
			params: {
				'_ep': '/businesses/search',
				'term': queryTerm,
				'location': location,
				'price': prices
			},
			headers: {
				'Authorization': 'Bearer ' + API_KEY
			}
		}).then(function (response) {
			console.log('response:', response.data, response);
			generateSuccessHTMLOutput(response);
			sendDataToGoogle(response);
		});
	};

	var getCheckedValues = function getCheckedValues(checkedItems) {
		var checkedValues = [].concat(_toConsumableArray(checkedItems)).map(function (checkedItem) {
			return checkedItem.value;
		});
		var allChecked = checkedValues.join(',');
		console.log('allChecked', allChecked);
		return allChecked;
	};

	var generateSuccessHTMLOutput = function generateSuccessHTMLOutput(response) {
		resultsEl.innerHTML = " ";
		response.data.businesses.forEach(function (business) {
			var $li = document.createElement("li");
			var $h2 = document.createElement("h2");
			var $pAddress = document.createElement("p");
			var $pCity = document.createElement("p");
			var $imgEl = document.createElement('img');

			$h2.innerHTML = '<a href="' + business.url + '">' + business.name + '</a>' + " - " + business.price + " - " + business.rating;
			$imgEl.src = business.image_url;
			$imgEl.style.width = '300px';
			$imgEl.style.height = '200px';
			$pAddress.innerHTML = business.location.address1;
			$pCity.innerHTML = business.location.city + " " + business.location.zip_code;
			$pCity.style.marginBottom = "5px";

			$li.appendChild($h2);
			$li.appendChild($imgEl);
			$li.appendChild($pAddress);
			$li.appendChild($pCity);

			resultsEl.appendChild($li);
		});
	};

	var sendDataToGoogle = function sendDataToGoogle(response) {
		var locationsArray = [];
		response.data.businesses.forEach(function (business) {
			var coordinate = {
				name: business.name,
				lat: business.coordinates.latitude,
				lng: business.coordinates.longitude
			};
			locationsArray.push(coordinate);
		});
		// console.table(locationsArray)
		GoogleMapModule.showMarkers(locationsArray);
	};

	return {
		sendDataToGoogle: sendDataToGoogle
	};
})();
//# sourceMappingURL=main.js.map

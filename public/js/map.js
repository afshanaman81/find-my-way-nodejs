
let map
let geocoder
let originMarker = null
let destMarker = null
let directionsDisplay = null

function initMap() {
	let abdab = { lat: 24.47, lng: 54.354 }
	let initPosition = abdab

	geocoder = new google.maps.Geocoder()
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: initPosition
	})
	/*let initMarker = new google.maps.Marker({
		position: initPosition,
		map: map
	})*/

	$('drive').on('click', drivingDirections)
	showCurrentLocation()
	getOriginDestination()
}

function showCurrentLocation() {
	// Place a custom marker at the Current Position
	// Get the current pos from browser's location
	// Open info window on clicking the marker
	let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
	let currMarker = new google.maps.Marker({
		map: map,
		icon: iconBase + 'info-i_maps.png'
	})

	let infoWindow = new google.maps.InfoWindow()
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				let currPosition = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
				map.setCenter(currPosition)
				currMarker.setPosition(currPosition)
				currMarker.addListener('click', function() {
					infoWindow.setContent('You are Here!')
					infoWindow.open(map, currMarker)
				})
			},
			function() {
				handleLocationError(true, infoWindow, map.getCenter())
			}
		)
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter())
	}
}

function handleLocationError() {
	console.log("Browser doesn't support Geolocation")
}

function getOriginDestination() {
	let mousedUp = false
	let pointCounter = 0

	google.maps.event.addListener(map, 'mousedown', function(event) {
		mousedUp = false
		setTimeout(function() {
			if (mousedUp === false) {
				pointCounter++
				//console.log(pointCounter)
				// assign first value to the origin
				if ((pointCounter == 1) | ($('#origin').text() === '')) {
					//console.log('Filling origin only')
					//lat and lng is available in event object
					let latLng = event.latLng
					originMarker = new google.maps.Marker({
						position: latLng,
						map: map
					})
					getAddress(latLng, function(origin) {
						//console.log(origin)
						$('#origin').text("From: " + origin)
						$('#originLat').text(latLng.lat)
						$('#originLng').text(latLng.lng)
					})
				}
				// once the origin is filled, assign the next value to the dest
				if (pointCounter > 1) {
					//& $("#dest").text() === ""
					//console.log('Filling dest only')
					//lat and lng is available in event object
					let latLng = event.latLng
					destMarker = new google.maps.Marker({
						position: latLng,
						map: map
					})
					getAddress(latLng, function(dest) {
						//console.log(dest)
						$('#dest').text("To: " + dest)
						$('#destLat').text(latLng.lat)
						$('#destLng').text(latLng.lng)
					})
				}
			}
		}, 800)
	})
	google.maps.event.addListener(map, 'mouseup', function(event) {
		mousedUp = true
	})

	$('#drive').on('click', drivingDirections)
}

function getAddress(latlng, callback) {
	geocoder.geocode({ latLng: latlng }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			//console.log(results)
			if (results[1]) {
				//formatted address
				let address = results[0].formatted_address
				callback(address)
			} else {
				alert('No results found')
			}
		} else {
			alert('Geocoder failed due to: ' + status)
		}
	})
}
function drivingDirections() {
	// remove the markers
	if (destMarker != null) {
		destMarker.setMap(null)
	}
	if (originMarker != null) {
		originMarker.setMap(null)
	}

	// remove previous route
	if (directionsDisplay != null) {
		directionsDisplay.setMap(null)
	}

	// get origin and dest (not from address, but from the exact latlng
	let origin = new google.maps.LatLng(
		$('#originLat').text(),
		$('#originLng').text()
	)
	let dest = new google.maps.LatLng(
		$('#destLat').text(),
		$('#destLng').text()
	)

	let directionsService = new google.maps.DirectionsService()
	directionsDisplay = new google.maps.DirectionsRenderer()
	directionsDisplay.setMap(map)

	directionsService.route(
		{
			origin: origin,
			destination: dest,
			travelMode: 'DRIVING'
		},
		function(response, status) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response)
			} else {
				window.alert('Directions request failed due to ' + status)
			}
		}
	)
}

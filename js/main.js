// v1.11
$(document).ready(function(){
	$.getJSON("./js/states_pretty.JSON",function(states){
		var styleNum, legendScale, condition, fillO, dataType, errorType, infoWindow1;
		// SECTION 1: ADDING HTML TO DOM
		// Append state names to the dropdown menu
		var optionTag = ['<option value="','">','</option>'];
		var stateSelect = $('#state-select');

		for (var state in states){
			if (state==='Washington state' || state==='New York state') {
				stateSelect.append(optionTag[0] + state + optionTag[1] +state.replace(' state','')+ optionTag[2]);
			} else{
				stateSelect.append(optionTag[0] + state + optionTag[1] + state + optionTag[2]);
			}; // DONE: if (state==='Washington state' || state==='New York state')
		}; // DONE: for (var state in states)

		// Append map types to the second dropdown menu
		var mapTypeSelect = $('#map-type-select');
		var mapTypes = ['Income','Rent'];

		for (var i=0; i<mapTypes.length; i++){
			mapTypeSelect.append(optionTag[0] + mapTypes[i] + optionTag[1] + mapTypes[i] + optionTag[2]);
		}; // DONE: for (var i=0; i<mapTypes.length; i++)
		// DONE ADDING HTML TO DOM


		// SECTION 2: Create the Google map with the coordinates and add the Fusion Tables layer to it. Plus, it zooms and centers to whatever state is selected.
		var geocoder,gmap;
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		function initialize(){
				geocoder = new google.maps.Geocoder(); // This variables is used to automate zooming and centering in this script
				gmap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); // Removing this removes the Google Maps layer -- but would it keep any layers on top of it?

				geocoder.geocode(
					{
						'address':'United States'
					},
					function(results,status){
						var sw = results[0].geometry.viewport.getSouthWest();
						var ne = results[0].geometry.viewport.getNorthEast();
						var bounds = new google.maps.LatLngBounds(sw,ne);
						
						gmap.fitBounds(bounds)
					} // DONE: function(results,status)
				); // DONE: geocoder.geocode


			// SECTION 2.1: The 'Change Map Size' button
			$('#button-mapsize').click(
				function changeMapSize(){
					var slideToggleArr = ['h1','h2','#note']; // These are the DOM elements that will be hidden or shown when the 'Change Map Size' button is clicked
					var mapCanvas = $('#map-canvas')
					var mapHeight = mapCanvas.height();
					var bodyHeight = $('body').height();

					$(slideToggleArr.join(',')).slideToggle(); // Toggles visibility of all elements in 'slideToggleArr'
					
					// If the map is NOT the same size as the 'body', then embiggen it. Otherwise, shrink it back down.
					if (mapHeight!=bodyHeight){
						mapCanvas.animate({height:'100%'});
					} else {
						mapCanvas.animate({height:'75%'});
					};					
				}
			);


			// SECTION 3: Find the address once the button is clicked
			var layer = null;
			var infoWindow = new google.maps.InfoWindow();
			$('#button-search').click(
				function codeAddress(){
					// The following commented-out block is for future use -- possibly to desaturate the map, since it's easier to read colored data on a black-and-white background.
					// var mapStyle = 'map-style';

					// var style = [
					// 	{
					// 		stylers: [
					// 			{
					// 				saturation: -90
					// 			}
					// 		]
					// 	}
					// ];

					// var styleObj = {
					// 	map: gmap,
					// 	name: 'Styled Map'
					// };

					// var styledMapType = new google.maps.StyledMapType(style, styleObj);

					infoWindow.close(); // Closes any open infoWindows when the "Search" button is clicked
					var stateSelectText = $("#state-select option:selected").text();
					var mapTypeText = $('#map-type-select option:selected').text();
					if (stateSelectText==="PICK A STATE" || mapTypeText==="PICK MAP TYPE"){ // Safeguard against clicking "Search" without picking a state or map type
						alert("Please pick a state and map type, then click \"Search\"");
					} else {
						
						var address = document.getElementById("address").value;
						var selectedState = document.getElementById("state-select").value;
						var locationColumn = 'geometry';
						var tableId = states[selectedState]["tableId"];

						if(mapTypeText==="Income"){
							condition = 'median_hh_income > 0 AND error > 0';
							if ($('input[name=colorblind]:checked').val()==="colorblind") { // Colorblind option
								styleNum = 3;
								legendScale = 'styleNum3.png';
							} else {
								styleNum = 2;
								legendScale = 'styleNum2.png';
							}; // DONE; if ($('input[name=colorblind]:checked').val()==="colorblind")

							fillO = 0.4;

							dataType = 'median_hh_income';
							errorType = 'error'; // The error margin for median household income
							rangeType = 'medianIncome';

							infoWindow1 = 'Median household income';
							infoWindow2 = 'Statewide middle-class income range';
						} else if(mapTypeText==="Rent"){
							condition = 'median_rent > 0';
							styleNum = 4;
							fillO = 0.6;
							legendScale = 'styleNum4.png';

							dataType = 'median_rent';
							errorType = 'rent_error';
							rangeType = 'medianRent';

							infoWindow1 = 'Median monthly rent';
							infoWindow2 = 'Statewide middle rental-range';
						}; // DONE: if(mapTypeText==="Income")
						var infoWindow1Lower = infoWindow1.toLowerCase();

						
						var strokeC = '#ffffff';
						var strokeO = 0.3;

						var layerObj = {
							query: {
								select: locationColumn,
								from: tableId,
								where: condition
							},
							styles: [
								{
									polygonOptions: {
										strokeColor: strokeC,
										strokeOpacity: strokeO,
										fillOpacity: fillO
									}
								}
							],
							styleId: styleNum,
							suppressInfoWindows: true
						};
						
						geocoder.geocode(
							{
								'address':address + ',' + selectedState
							},
							function(results,status){
								if(status===google.maps.GeocoderStatus.OK){
									var addressSW = results[0].geometry.viewport.getSouthWest();
									var addressNE = results[0].geometry.viewport.getNorthEast();
									var bounds = new google.maps.LatLngBounds(addressSW,addressNE);
									gmap.fitBounds(bounds);

									// Before the first time ':button' runs, 'layer' should be null. This if/else statement is to make sure only one FT map is on the map at a time.
									if (layer===null) {
										layer = new google.maps.FusionTablesLayer(layerObj);
										layer.setMap(gmap);
									} else {
										layer.setOptions(layerObj);
									}; // DONE: if (layer===null)

									// Add custom Infowindows to the map
									google.maps.event.addListener(layer,'click',function(e){
										var medianVal = accounting.formatMoney(e.row[dataType].value);
										var marginError = accounting.formatMoney(e.row[errorType].value);
										var midRange1 = accounting.formatMoney(states[selectedState][rangeType]["percent40"]);
										var midRange2 = accounting.formatMoney(states[selectedState][rangeType]["percent60"]);

										e.infoWindowHtml = [
											'<b>' + e.row['label'].value + '.</b>',
											'<b>' + infoWindow1 + ':</b> ' + medianVal + ' (+/- ' + marginError + ').',
											'<b>' + infoWindow2 + ':</b> ' + midRange1 + ' to ' + midRange2 + '. <br>',
											'<i>All data come from the 2007-2011 <a href="http://www.census.gov/acs/www/" target="_blank">American Community Survey</a>. The statewide middle range covers Census Tracts which have a '+ infoWindow1Lower +' higher than the lowest 40 percent -- and lower than the highest 40 percent -- of this state\'s Census Tracts.</i>'
										];
										infoWindow.setContent('<div class="info-window">' + e.infoWindowHtml.join('<br>') + '</div>');
										infoWindow.setPosition(e.latLng);
										infoWindow.open(gmap);
									}); // DONE: google.maps.event.addListener
									
								   	// Setting up and adding the legend
								   	var bottom5Perc = accounting.formatMoney(states[selectedState][rangeType]["percent5"]);
								   	var top5Perc = accounting.formatMoney(states[selectedState][rangeType]["percent95"]);
									var legendLabels = [
										'<h3 id="legend-title">'+selectedState+' '+infoWindow1Lower+' (in 2011 dollars)</h3> <div id="legend-labels">',
										'<span id="bottom5">'+bottom5Perc+' or less</span>',
										'<img id="gradient" src="./images/'+legendScale +'" />',
										'<span id="top5">'+top5Perc+' or more</span>'
									];

									// If there is no div with the id 'legend,' make one.
									var legend = $('div#legend');
									if ($('div#legend').length===0) {
										var legend = document.createElement('div');
										legend.id = 'legend';
									   	legend.innerHTML = legendLabels.join('');
									   	gmap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend); // Pushes the legend to the right-bottom of the map	
									} else {
										$('div#legend').html(legendLabels.join('')); // Similar to 'legend.innerHTML = legendLabels.join('')', except this line of code allows the gradient image to change depending on color mode
									}; // DONE: if ($('div#legend').length===0)
									
									// Change the legend labels
									$('#legend-title').html(selectedState+' '+infoWindow1Lower+' (in 2011 dollars)');
									$('#bottom5').html(bottom5Perc+' or less');
									$('#top5').html(top5Perc+' or more');

								} else {
									alert("Couldn't find address for the following reason: " + status + ". Sorry about that. Please try another address.");
								} // DONE: if(status===google.maps.GeocoderStatus.OK)
							} // DONE: function(results,status)
						); // DONE: geocoder.geocode
						
						// Desaturate the map after clicking 'Search'
						// gmap.mapTypes.set(mapStyle, styledMapType);
						// gmap.setMapTypeId(mapStyle);

					}; // DONE: if ($("#state-select option:selected").text()==="PICK A STATE")
				} // DONE: function codeAddress()
			); // DONE: $(':button').click()
		} // DONE: function initialize()
		google.maps.event.addDomListener(window, 'load', initialize);
	}); // DONE: $.getJSON()
}); // DONE: $(document).ready()
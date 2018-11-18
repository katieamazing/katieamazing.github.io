var token = '3289111688.7e19c20.1acfeccdcb574e06883cc2ede0b33dac',
    num_photos = 10;
 
$.ajax({
	url: 'https://api.instagram.com/v1/users/self/media/recent',
	dataType: 'jsonp',
	type: 'GET',
	data: {access_token: token, count: num_photos},
	success: function(data){
 		console.log(data);
		for( x in data.data ){
			$('#instafeed').append('<div class="grid-item"><div><a href="https://www.instagram.com/kt_amazing/"><img src="'+data.data[x].images.low_resolution.url+'"/></a></div></div>');
		}

	// init Masonry
	var $grid = $('.grid').masonry({
		itemSelector: '.grid-item',
		columnWidth: 200,
		isFitWidth: true
	});
	// layout Masonry after each image loads
	$grid.imagesLoaded().progress( function() {
	  $grid.masonry('layout');
	});
		
        },
	error: function(data){
		console.log(data);
	}
});


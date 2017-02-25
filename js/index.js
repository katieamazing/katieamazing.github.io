// external js: masonry.pkgd.js, imagesloaded.pkgd.js

// init Isotope
var grid = document.querySelector('.grid');

var msnry = new Masonry( grid, {
  itemSelector: '.grid-item',
  columnWidth: 200,
  fitWidth: true
});

imagesLoaded( grid ).on( 'progress', function() {
  // layout Masonry after each image loads
  msnry.layout();
});

// instafeed stuff

var token = '3289111688.7e19c20.3cbe4dbdeb184875b2bf172d599b6b2b',
    num_photos = 10;
 
$.ajax({
	url: 'https://api.instagram.com/v1/users/self/media/recent',
	dataType: 'jsonp',
	type: 'GET',
	data: {access_token: token, count: num_photos},
	success: function(data){
 		console.log(data);
		for( x in data.data ){
			$('#instafeed').append('<div class="grid-item"><img src="'+data.data[x].images.low_resolution.url+'"></div>');
		}

    $('.grid').masonry({
      itemSelector: '.grid-item',
      columnWidth: 200,
      isFitWidth: true
    });
	},
	error: function(data){
		console.log(data);
	}
});

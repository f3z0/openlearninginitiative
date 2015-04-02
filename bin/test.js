/**
 * DISCLAIMER
 * This is a relatively simple example, to illustrate some of the
 *   possible functionalities and how to achieve them.
 *   There is no guarantee that this example will provide useful
 *   results.
 *   Use this example with and at your own responsibility.
 *
 * In this example we run through a list of links, if they have a
 *   route defined they will be scraped. Their title, language and 
 *   first paragraph.
 *
 * To run:
 * 'node WikimediaScraper.js link1 [... linkN]'
 */

var sjs = require('scraperjs'),
	async = require('async'),
	parseUrl = require('url').parse,
	urls = process.argv.slice(2),
	fs = require('fs');

var IMDB_SELECTOR = '[itemprop=description]',
	gatheredInformation = [],
	unknownRoutes = [];

var router = new sjs.Router({
	firstMatch: true
});

var checked = [];
var queued = 0;

	router.on('https?://(www.)?edx.org/course/:id')
	    .createStatic()
	    .scrape(function($) {
	    	queued--;
	    	console.log('Q: ' + queued);
	    	var record = {
	        	title: $('meta[property="og:title"]').attr("content"),
	        	'short-desc': $('meta[property="og:description"]').attr("content"),
	        	description: $('span[itemprop="description"]').html(),
	        	school: $($('.course-detail-school a')[0]).text(),
	        	video: {
	        		url: $('meta[property="og:video"]').attr("content"),
	        		width: $('meta[property="og:video:width"]').attr("content"),
	        		height: $('meta[property="og:video:height"]').attr("content")
	        	}
	        }
	        process.nextTick(function() {
	        	fs.appendFile(__dirname+'/records.json', JSON.stringify(record)+"\n", function(err) {
	        	    if(err) {
	        	         console.log(err);
	        	    }
	        	}); 
	        })
	        
	    }, function(links, utils) {
	    })

	    router.on('https?://(www.)?edx.org/*')
	        .createStatic()
	        .scrape(function($) {
	        	queued--;
	        	console.log('Q: ' + queued);
	        	return $('a').map(function(i, el) {
	        	  // this === el
	        	  return $(this).attr('href');
	        	}).get();	            
	        }, function(links, utils) {
	            async.each(links, function(url, done) {
	            	if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
	            		url = 'https://www.edx.org'  + url;
	            	}

	            	if (checked.indexOf(url) === -1 && url.indexOf('edx.org') !== -1){
				checked.push(url);
				queued++;
				console.log('Q: ' + queued + ' ' + url);
				process.nextTick(function() {
					fs.appendFile(__dirname+'/scanned.txt', url+"\n", function(err) {
					    if(err) {
					         console.log(err);
					    }
					    router.route(url, function(found, returned) {
					    	done();
					    });
					});
					
				});
	            	} else {
	            		process.nextTick(function() {
	            			done();
	            		});
	            	}
	            	
	            }, function(err) {
	            	if(err) {
	            		console.log(err.message);
	            		return;
	            	}

	            })
	        })

	        checked.push(urls[0]);
	        queued++;
	        console.log('Q: ' + queued + ' ' + urls[0]);
	        fs.appendFile(__dirname+'/scanned.txt', urls[0]+"\n", function(err) {
	            if(err) {
	                 console.log(err);
	            }
	            router.route(urls[0], function(found, returned) {
	            	//done();
	            });
	        }); 
	        

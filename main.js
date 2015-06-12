var page = require ('webpage').create(),
    url = 'http://united.com',
    refresh = 0,
    currentUrl, alreadyReloaded;

/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript console. The callback may accept up to three arguments: 
 * the string for the message, the line number, and the source identifier. Must be declared for it to run.
 */
page.onConsoleMessage = function (msg, line, source) {
    console.log('console> ' + msg);
};

page.onUrlChanged = function(targetUrl) {
    currentUrl = targetUrl;
};

page.onLoadFinished = function(status) {
    console.log("Load finished: " + status)
   /** It goes into the conditional below multiple times for some reason?
    */
    if (phantom.state && status == "success" && !alreadyReloaded) { 
    	  phantom.state();
        setTimeout ( function () { 
          console.log ("Page reload now...");
          page.reload(); 
        }, 60000 );
        alreadyReloaded = true;
    }
};

// Callback is executed each time a page is loaded...
page.open(url, function (status) {
  if (status === 'success') {
    if( !phantom.state ) initialize();
  }
});

// Step 1
function initialize() {
    page.injectJs('jquery.js');
  	page.evaluate(function() {
    	$('#ctl00_ContentInfo_Booking1_rdoSearchType2').click();
    	$('#ctl00_ContentInfo_Booking1_Origin_txtOrigin').val('Philadelphia, PA');
    	$('#ctl00_ContentInfo_Booking1_Destination_txtDestination').val('San Francisco, CA');
    	$('#ctl00_ContentInfo_Booking1_DepDateTime_Depdate_txtDptDate').val('6/15/2015');
    	$('#ctl00_ContentInfo_Booking1_SearchBy_rdosearchby3').click()
    	$('#ctl00_ContentInfo_Booking1_btnSearchFlight').click();
  	});  
  // Phantom state doesn't change between page reloads
  // We use the state to store the search result handler, ie. the next step
  phantom.state = parseResults;
}

// Step 2

function parseResults () {
	page.injectJs('jQuery.js');
	refresh++;
	console.log("Refresh #: " + refresh + " " + new Date ());
	var result = page.evaluate ( function() {
    	//var arr = $('.tdRewardPrice:nth-child(1) .btnBlue');
	    if ( $('#ctl00_ContentInfo_resultsReward_showSegmentsReward1_ShowSegment_ctl00_ShowReward_ctl00_rewardSelect').length > 0 ) { 
	    	return "Saver award available"; 
	    } else {
	    	return "Can't find saver award";
	    }
    })
  console.log(result)
  alreadyReloaded=false; // When we are finished, reset alreadyReloaded
}

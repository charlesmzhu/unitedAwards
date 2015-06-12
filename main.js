var page = require ('webpage').create(),
    url = 'http://united.com',
    refresh = 0,
    currentUrl;

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
    console.log('Load Finished: ' + status);
    if (phantom.state) { 
    	phantom.state();
    	setInterval ( function () { 
    		page.reload();
    		refresh++;
    		console.log("Refresh #: " + refresh); 
    		page.injectJs('jquery.js'); 
    		phantom.state(); }
    	, 120000 );
    }
};

page.onLoadStarted = function() {
};


// Callback is executed each time a page is loaded...
var openPage = page.open(url, function (status) {
  if (status === 'success') {
    // State is initially empty. State is persisted between page loads and can be used for identifying which page we're on.
    // Inject jQuery for scraping (you need to save jquery-1.6.1.min.js in the same folder as this file)
    
	page.injectJs('jquery.js');
    if( !phantom.state ) initialize();
  }
});

// Step 1
function initialize() {
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

var parseResults = function () {
  page.evaluate( function() {
    //var arr = $('.tdRewardPrice:nth-child(1) .btnBlue');
    if ( $('#ctl00_ContentInfo_resultsReward_showSegmentsReward1_ShowSegment_ctl00_ShowReward_ctl00_rewardSelect').length > 0 ) { 
    	console.log ("Saver award available"); 
    } else {
    	console.log ("Can't find saver award");
    }
  });
}
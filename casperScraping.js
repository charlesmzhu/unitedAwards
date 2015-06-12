casper = require('casper').create();

casper.start('http://united.com', function () {
	this.click('#ctl00_ContentInfo_Booking1_rdoSearchType2');
    this.sendKeys('#ctl00_ContentInfo_Booking1_Origin_txtOrigin',  'Philadelphia, PA' );
    this.sendKeys('#ctl00_ContentInfo_Booking1_Destination_txtDestination', 'San Francisco, CA' );
    this.sendKeys('#ctl00_ContentInfo_Booking1_DepDateTime_Depdate_txtDptDate', '6/15/2015' );
    this.click('#ctl00_ContentInfo_Booking1_SearchBy_rdosearchby3');
    this.click('#ctl00_ContentInfo_Booking1_btnSearchFlight');
});

casper.then ( function () {
	casper.on ("url.changed", function ( url ) { return ; } );
});


	casper.then ( function () {
		var thisPage = this;
		checkForAward ( thisPage );
	});


/*
casper.then ( function () {
	var thisPage = this;
	setInterval ( function () {
		casper.reload();
		checkForAward ( thisPage );
	}, 30000 );
});
*/
function checkForAward ( thisPage ) {
	var awardExists = thisPage.exists ('#ctl00_ContentInfo_resultsReward_showSegmentsReward1_ShowSegment_ctl00_ShowReward_ctl00_rewardSelect');
	console.log(awardExists);
    if ( awardExists ) {
    	casper.echo ( "Desired award available");
    }
    casper.capture("whatpage.png"); 
}

casper.run();
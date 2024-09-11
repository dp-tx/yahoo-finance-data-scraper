/*
 DOWNLOAD YAHOO FINANCE DATA WITHOUT SIGNING IN OR PAYING!
 
 Copy this script and paste it in the console of your browser's inspect element tool, then press enter.
 The inspect tool is usually opened with the F12 key, or right click anywhere on the page -> Inspect 
*/



function identifyDownloadBtn(){
/**
This is supposed to locate a single <a> element that is the download data button in the top right corner of the table
*/	
	aTags = document.getElementsByTagName("a");
	downloadLinkBtn = null;
	for(i = 0; i < aTags.length; i++){
		if (aTags[i].innerText == "Download"){
			downloadLinkBtn = aTags[i];
			break;
		}
	}
	if(downloadLinkBtn == null){
		alert("The script was not able to locate the HTML link element for the download button.");
		throw new Error();
	}
	return downloadLinkBtn;
}

function identifyDataTable(){
	/**
	This is supposed to locate the main <table> element that contains all of the historical data to be scraped
	*/
	dataTable = null;
	tablesInDocument = document.querySelectorAll("table");
	for (let i = 0; i < tablesInDocument.length; i++) {
		currentTable = tablesInDocument[i];
		headerItems = currentTable.querySelectorAll("thead tr th");
		if (headerItems[0].innerText == "Date" && headerItems[1].innerText == "Open" && headerItems[2].innerText == "High"){
			dataTable = currentTable;
			break;
		}
	}
	if(dataTable == null){
		alert("The script was not able to locate the HTML table element that contains the financial data.");
		throw new Error();
	}
	return dataTable;
}

function identifyDataFreqBtns(){
	/**
	This is supposed to locate the two html <button> elements that contain the date range of the data, and the frequency
	*/
	dateBtn = null;
	freqBtn = null;
	tertiaryBtns = document.getElementsByClassName("tertiary-btn fin-size-small");
	for (let i = 0; i < tertiaryBtns.length; i++) {
		btn = tertiaryBtns[i];
		if (btn.innerText.includes("-") && ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].includes(btn.innerText.substr(0,3))){
			dateBtn = btn;
		}
		if (["Daily", "Weekly", "Monthly"].includes(btn.innerText)){
			freqBtn = btn;
		}
	}
	
	if(dateBtn == null || freqBtn == null){
		alert("The script was not able to locate the HTML button elements that contain the dates and frequency.");
		throw new Error();
	}
	return [dateBtn, freqBtn];
}

function identifyTickerLabel(){
	/**
	This is supposed to locate the h1 tag with the name and ticker symbol
	*/
	tickerLbl = null;

	h1s = document.getElementsByTagName("h1");
	for (let i = 0; i < h1s.length; i++) {
		h1Elem = h1s[i];
		if(h1Elem.parentElement.tagName.toLowerCase() == "section"){
			tickerLbl = h1Elem;
			break;
		}
	}
	
	if(tickerLbl == null){
		alert("The script was not able to locate the HTML label with the name and ticker symbol");
		throw new Error();
	}
	return tickerLbl;
}



function scrapeCSVData(){
	/**
	Reads the html table row by row and creates the raw text to put into the CSV.
	Also generates the file name based on ticker symbol/name, date, and frequency.
	*/
	let dfBtns = identifyDataFreqBtns();
	DATE_RANGE_BTN = dfBtns[0];
	FREQ_BTN = dfBtns[1];
	DATA_TABLE = identifyDataTable();
	TICKER_LBL = identifyTickerLabel();

	
	csvText = "";

  //header row
	DATA_TABLE.querySelectorAll("thead tr th").forEach((d) => {csvText += d.innerText.trim() + ",";})
	csvText = csvText.substr(0, csvText.length - 1) + "\n";
	
	tableRowElems = DATA_TABLE.querySelectorAll("tbody tr"); //finds all rows in table
	for (let i = 0; i < tableRowElems.length; i++) {
		tempText = "";
		tableRowElems[i].querySelectorAll("td").forEach((d) => {tempText += d.innerText.trim().replaceAll(",", "") + ",";}); //concatenate each cell in the row with commas in between; delete commas
		splitText = tempText.split(" "); //splits by spaces, which is the delimiter for the date tokens
		tempText = splitText[1] + "-" + splitText[0] + "-" + splitText.slice(2,splitText.length).join(""); //reformat data to be DD-Month-YYYY to be Excel-friendly
		tempText = tempText.substr(0, tempText.length - 1) + "\n"; //trailing comma should be deleted and a newline should be placed there instead
		csvText += tempText;
	}
	
	nameAndSymbol = TICKER_LBL.innerText.trim();
	fileName = nameAndSymbol + " " + FREQ_BTN.innerText + " " + DATE_RANGE_BTN.innerText + ".csv";
	return [fileName, csvText];
}

DOWNLOAD_BTN = identifyDownloadBtn();
if(DOWNLOAD_BTN.children.length >= 1){ 
	DOWNLOAD_BTN.children[0].remove(); //get rid of that stupid lock icon next to download
}
DOWNLOAD_BTN.href = "#"; //so it doesn't redirect to the paywall
DOWNLOAD_BTN.addEventListener('click', function () {
	data = scrapeCSVData();
	const text = data[1];
	const blob = new Blob([text], { type: 'text/plain' }); //prepare the csv file
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
  //create a dummy link to download the file and then delete it
	link.href = url;
	link.download = data[0];
	link.click();
	document.body.removeChild(link);
});


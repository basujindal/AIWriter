// Define the function that checks for the focused text box
function getFocusedTextbox() {
    var activeElement = document.activeElement;

    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'DIV')) {
        console.log("Current text box value", activeElement.value);
    } else {
        console.log(document.activeElement.tagName);
    }
    // console.log(document.activeElement);

}

// Set an interval to run the function every 500 milli seconds
setInterval(getFocusedTextbox, 1000);



prompt = "You are a helpful writing assistant.You help in suggesting the next words to what the user is writing"
// take n_predict from the user
n_predict = 50;

console.log("Content script running");
function parseResponse(responseText) {
    // Split the response into lines
    const lines = responseText.trim().split('\n');

    // Initialize an array to hold the parsed content
    let parsedContents = [];

    // Loop through each line
    lines.forEach(line => {
        // Check if the line starts with 'data: '
        if (line.startsWith('data: ')) {
            try {
                // Parse the JSON part of the line
                const jsonData = JSON.parse(line.substring(5).trim()); // Adjusted to 5 to remove 'data: '
                parsedContents.push(jsonData.content);
            } catch (error) {
                console.error('Error parsing line:', line, error);
            }
        }
    });

    // Combine the content from each line
    combinedContent = parsedContents.join('');
    console.log('Combined Content:', combinedContent);
    return combinedContent;
}


function sendFetchRequest(user_input, element) {
    fetch('http://127.0.0.1:8080/completion', {
        method: 'POST',
        headers: {
            'Accept': 'text/event-stream',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/json',
            'Cookie': 'messages=W1siX19qc29uX21lc3NhZ2UiLDAsMjUsIlN1Y2Nlc3NmdWxseSBzaWduZWQgaW4gYXMgYmppbmRhbC4iXV0:1r8zFB:KIn1CWccoReEBRDFMkZ4XIzB8RoylNoSSG6tcpJoW70; csrftoken=WnmLsuB7kg8sTeIf97Wv4YTbQxrN0DrLiYFCtvKbqcau5uZguacQSe05oehqX7Hk; sessionid=3crvjjxbatkl9wum7zgh4zatwim5dc0s',
            // 'Origin': 'http://127.0.0.1:8080',
            'Referer': 'http://127.0.0.1:8080/',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61',
            'sec-ch-ua': '"Chromium";v="118", "Microsoft Edge";v="118", "Not=A?Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"'
        },
        body: JSON.stringify({
            "stream": true,
            "n_predict": n_predict,
            "temperature": 0.1,
            "stop": [],
            "repeat_last_n": 256,
            "repeat_penalty": 1.18,
            "top_k": 40,
            "top_p": 0.5,
            "tfs_z": 1,
            "typical_p": 1,
            "presence_penalty": 0,
            "frequency_penalty": 0,
            "mirostat": 0,
            "mirostat_tau": 5,
            "mirostat_eta": 0.1,
            "grammar": "",
            "n_probs": 0,
            "image_data": [],
            "cache_prompt": true,
            "slot_id": 0,
            "prompt": prompt + "\n\n" + user_input
        }),
        compress: true
    })
        .then(response => response.text())
        .then(data => {
            combinedContent = parseResponse(data);
            if (combinedContent.trim() !== '') {
                // element.value = element.value + combinedContent;
                // add combinedContent to the element in lighter color
                var span = document.createElement("span");
                span.style.color = "lightgrey";
                span.innerText = combinedContent;
                element.appendChild(span);
                navigator.clipboard.writeText(combinedContent)
                    .then(() => {
                        console.log('Text copied to clipboard');
                    })
                    .catch(err => {
                        // This can happen if the user denies clipboard permissions:
                        console.error('Could not copy text: ', err);
                    });
            }
            // // if ctrl+v is pressed again, copy the combinedContent to clipboard
            // element.addEventListener("keydown", function copier(event) {
            //     if (event.ctrlKey && event.key === "v") {
            //         // event.preventDefault();
            //         navigator.clipboard.writeText(combinedContent)
            //             .then(() => {
            //                 console.log('Text copied to clipboard');
            //                 // document.execCommand('paste');
            //             })

            //             .catch(err => {
            //                 // This can happen if the user denies clipboard permissions:
            //                 console.error('Could not copy text: ', err);
            //             });
            //         console.log("removed copier");
            //         element.removeEventListener("keydown", copier);
            //     }            
            // }),

            element.addEventListener("keydown", function handler(event) {
                // check if span is present and remove it
                console.log("checking if span is present");
                if (span) {
                    console.log("removing span");
                    element.removeChild(span);
                }

                console.log("removed span");
                element.removeEventListener("keydown", handler);
                console.log("removed event listener");
            }
            );

        })
        .catch(error => console.error('Error:', error));
}


// function getFocusedTextbox() {
//     var activeElement = document.activeElement;

//     if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'DIV')) {
//         console.log("Current text box value", activeElement.value);
//         if (activeElement.value.trim() !== '') {
//             sendFetchRequest(activeElement.value, activeElement);
//         }
//     } else {
//         console.log(document.activeElement.tagName);
//     }
// }

function getFocusedTextbox() {

    var contenteditable = document.querySelector('[contenteditable]'),
    text = contenteditable.innerText;
    console.log("Current text box value", text);
    sendFetchRequest(text, contenteditable);
}

// setInterval(getFocusedTextbox, 5000);

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.shiftKey) {
        getFocusedTextbox();
    }
}
);
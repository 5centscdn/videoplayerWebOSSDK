// change the variable as per documentation start
let api_base_url = 'https://collector-videoplayer.5centscdn.net'; //api request url
let hash_id, url, title, tags, show_cv;
const viewer_id = generateUUID();
let view_id = generateRandomString();
let user_agent = navigator.userAgent;
var video = document.getElementById("myVideo");
// change the variable as per documentation end



// Get the parent element of the video player
var getParentElement = video.parentNode;
// add element to show count view
getParentElement.insertAdjacentHTML('beforeend', '<span style="position: absolute; top: 5px;left: 15px; color: #fff; font-size: 20px;" id="showCountView"></span>');
var countArea = document.getElementById("showCountView");

var pageLoadTime = 0;
var playerLoadTime = 0;
var timer;
var is_called = false;

window.onload = function () {
    var loadTime = window.performance.now();
    pageLoadTime = Math.round(loadTime);
};

video.addEventListener("loadedmetadata", function () {
    var playerInitTime = window.performance.now();
    playerLoadTime = Math.round(playerInitTime);
});

// video on playing event
video.addEventListener("play", function () {
    // Perform actions when the video starts playing
    if (!is_called) {
        onPlayEventWithValue(hash_id, title, tags, url, viewer_id, view_id, user_agent, "page_load", "", pageLoadTime)
        onPlayEventWithValue(hash_id, title, tags, url, viewer_id, view_id, user_agent, "player_load", "", playerLoadTime)
        onPlayEvent(hash_id, title, tags, url, viewer_id, view_id, user_agent, "impression", "")
        onPlayEvent(hash_id, title, tags, url, viewer_id, view_id, user_agent, "play", "")
        onPlayEvent(hash_id, title, tags, url, viewer_id, view_id, user_agent, "engagement", "")

        is_called = true;
    }
    if (show_cv) {
        showCV(hash_id);
    }
});

// video on complete event
video.addEventListener('ended', function () {
    onPlayEvent(hash_id, title, tags, url, viewer_id, view_id, user_agent, "complete", "")
    clearInterval(timer);
});

// check status start
function startAnalytics() {
    video.src = '#';
    hash_id = document.getElementById("hashid").value;
    title = document.getElementById("title").value;
    url = document.getElementById("url").value;
    tags = createStringArray(document.getElementById("tags").value);
    var checkbox = document.getElementById("show_cv");
    if (checkbox.checked) {
        show_cv = true;
    } else {
        show_cv = false;
    }

    fetch(api_base_url + '/v', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the appropriate request header
        },
        body: JSON.stringify({ hash_id: hash_id, url: url })
    })
        .then(function (response) {
            if (response.ok) {
                var statusCode = response.status;
                if (statusCode == 200) {
                    if (Hls.isSupported()) {
                        var hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function() {
                          video.play();
                        });
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                        video.addEventListener('loadedmetadata', function() {
                          video.play();
                        });
                    }
                    // playBtn.style.display = "none";
                    video.controls = true; // Show other controls, but disable play
                    // video.play(); // Attempt to play will be ignored
                } else {
                    video.controls = false; // Enable play
                }
                console.log(statusCode);
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            // Process the response data here
            console.log(data);
        })
        .catch(function (error) {
            // Handle any error that occurred during the request
            console.log('Error:', error.message);
        });
}
// end check status

// on play event request
function onPlayEventWithValue(hash_id, title, tags, url, viewer_id, view_id, user_agent, type, referer, value1) {
    fetch(api_base_url + '/t', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the appropriate request header
        },
        body: JSON.stringify({ hash_id: hash_id, title: title, tags: tags, url: url, viewer_id: viewer_id, view_id: view_id, user_agent: user_agent, type: type, referer: referer, value1: value1, })
    })
        .then(function (response) {
            if (response.ok) {
                var statusCode = response.status;
                console.log(statusCode);
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            // Process the response data here
            console.log(data);
        })
        .catch(function (error) {
            // Handle any error that occurred during the request
            console.log('Error:', error.message);
        });
}

function onPlayEvent(hash_id, title, tags, url, viewer_id, view_id, user_agent, type, referer) {
    fetch(api_base_url + '/t', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the appropriate request header
        },
        body: JSON.stringify({ hash_id: hash_id, title: title, tags: tags, url: url, viewer_id: viewer_id, view_id: view_id, user_agent: user_agent, type: type, referer: referer })
    })
        .then(function (response) {
            if (response.ok) {
                var statusCode = response.status;
                console.log(statusCode);
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            // Process the response data here
            console.log(data);
        })
        .catch(function (error) {
            // Handle any error that occurred during the request
            console.log('Error:', error.message);
        });
}
// end on play event request

// showcv
function showCV(hash_id) {
    var params = {
        hash_id: hash_id,
    };

    var queryString = Object.keys(params)
        .map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        })
        .join('&');

    var url = api_base_url + '/c?' + queryString; // Append the query string to the URL

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            // show count view
            countArea.innerHTML = data.count;
        })
        .catch(function (error) {
            console.log('Error: ', error.message);
        });
}

// UUID Generate
function generateUUID() {
    var cryptoObj = window.crypto || window.msCrypto; // For cross-browser compatibility

    if (cryptoObj && cryptoObj.getRandomValues) {
        var buffer = new Uint8Array(16);
        cryptoObj.getRandomValues(buffer);

        buffer[6] = (buffer[6] & 0x0f) | 0x40; // Set version 4
        buffer[8] = (buffer[8] & 0x3f) | 0x80; // Set variant 10

        var hexValues = Array.prototype.map.call(buffer, function (byte) {
            return ('0' + byte.toString(16)).slice(-2);
        });

        return (
            hexValues.slice(0, 4).join('') +
            '-' +
            hexValues.slice(4, 6).join('') +
            '-' +
            hexValues.slice(6, 8).join('') +
            '-' +
            hexValues.slice(8, 10).join('') +
            '-' +
            hexValues.slice(10).join('')
        );
    } else {
        // Fallback for browsers without crypto API
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

// random string
function generateRandomString() {
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';

    for (var i = 0; i < 23; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function getDownloadedBytes() {
    if (video.buffered.length > 0) {
        var currentTime = video.currentTime;
        var range = video.buffered;
        var start = 0;
        var end = 0;

        for (var i = 0; i < range.length; i++) {
            if (currentTime >= range.start(i) && currentTime < range.end(i)) {
                start = range.start(i);
                end = range.end(i);
                break;
            }
        }

        var bytesDownloaded = end - start;
        var roundedDownloadedBytes = Math.round(bytesDownloaded);
        downloadBytesOnTimePeriod(hash_id, title, tags, url, viewer_id, view_id, user_agent, "engagement", "", 10, roundedDownloadedBytes)
        if (show_cv) {
            showCV(hash_id);
        }
    }
}

function startTimer() {
    timer = setInterval(getDownloadedBytes, 10000); // Run every 10 seconds
}

function stopTimer() {
    clearInterval(timer);
}

// Add event listeners to start and stop the timer
video.addEventListener('play', startTimer);
video.addEventListener('pause', stopTimer);
video.addEventListener('ended', stopTimer);

function downloadBytesOnTimePeriod(hash_id, title, tags, url, viewer_id, view_id, user_agent, type, referer, value1, value2) {
    fetch(api_base_url + '/t', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hash_id: hash_id, title: title, tags: tags, url: url, viewer_id: viewer_id, view_id: view_id, user_agent: user_agent, type: type, referer: referer, value1: value1, value2: value2 }),

    })
        .then(function (response) {
            if (response.ok) {
                var statusCode = response.status;
                console.log(statusCode);
                return response.json();
            }
            console.log('10s: ' + response.status);
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            // Process the response data here
            console.log(data);
        })
        .catch(function (error) {
            // Handle any error that occurred during the request
            console.log('Error:', error.message);
        });
}

function createStringArray(inputString) {
    // Split the input string by commas
    const stringValues = inputString.split(',');
  
    // Trim each string value and create a new array
    const trimmedArray = stringValues.map((value) => value.trim());
  
    return trimmedArray;
}
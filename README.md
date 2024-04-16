# 5centsCDN Analytics Demo

Steps to use 5CentsCDN Analytics Library for webOS:

Step 1: Add the library in your app

Step 2.1: add script  your html header
```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.5.14/hls.min.js"></script>
```

Step 2.2: Initiate html5 video player
```
var video = document.getElementById("myVideo");
```

Step 3: config your app
```
let hash_id = '4gpuj6i3znoio7r4';
```


Step 4: Initialize the following variables from the custom libraries provided
```
let url = 'https://woj7lng8dg82-hls-live.5centscdn.com/103_push_2351_001/e1f28fb33effa6a53242a82acbb245de.sdp/playlist.m3u8';
let title = "5centCDN Video Test";
let tags = ["1080p", "10s", "30MB"];
let show_cv = true;
const viewer_id = generateUUID();
let view_id = generateRandomString();
let user_agent = navigator.userAgent;
```
Step 5: Initiate the analytics 
```
  startAnalytics()
```

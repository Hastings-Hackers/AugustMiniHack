// Create the three.js scene
var scene = new THREE.Scene();

// Create the renderer for the scene
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Set the renderers size
renderer.setSize( window.innerWidth, window.innerHeight );

// Set the background color of the renderer. Create a custom color with a Hex value.
renderer.setClearColor(new THREE.Color("#4099FF"));

// Append the renderer to the document
document.body.appendChild(renderer.domElement);

// Create a camera, in this case a perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );

// Set the x/y/z position of the camera
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 2;

// Set the location  x/y/z position the camera should look at
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Create a directional light so objects in the scene can be seen
var directionalLight = new THREE.DirectionalLight(new THREE.Color("#FFFFFF"), 1.0); 

// Set the x/y/z poition of the directional light
directionalLight.position.set(0, 1, 3); 

// Add the light to the scene
scene.add(directionalLight);

var radius = 1;

var geometry = new THREE.SphereGeometry(radius, 100, 100 );
var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );

var sphere1 = new THREE.Mesh( geometry, material );
sphere1.position.x = -1;

var sphere2= new THREE.Mesh( geometry, material );
sphere2.position.x = 1;

scene.add( sphere1 );
scene.add( sphere2 );

// Creates the render function and this will call itself recursively
var render = function () {
	requestAnimationFrame( render );
	
	renderer.render(scene, camera);
};

// Starts the rendering
render();

// Add a resize event to the window so the scene resizes if the window changs size
window.addEventListener( 'resize', function() {
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

try {
	// Create a instance of AudioContext interface
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

	var context = new AudioContext();

	var splitter = context.createChannelSplitter(2);

	var analyser1 = context.createAnalyser();
	analyser1.fftSize = 2048;
	var bufferLength1 = analyser1.frequencyBinCount; 
	var dataArray1 = new Uint8Array(bufferLength1);

	var analyser2 = context.createAnalyser();
	analyser2.fftSize = 2048;
	var bufferLength2 = analyser2.frequencyBinCount; 
	var dataArray2 = new Uint8Array(bufferLength2);

	var source = context.createBufferSource(); 

	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:8080/music/test2.mp3', true);
	request.responseType = 'arraybuffer';
	request.onload = function(){
		context.decodeAudioData(request.response, function(buffer) {
			source.buffer = buffer;
		}, null);
	}
	request.send();

	source.connect(context.destination);
    source.connect(splitter);

	splitter.connect(analyser1,0,0);
	splitter.connect(analyser2,1,0);

	source.start(0);

	function draw() {
		requestAnimationFrame(draw);

		//analyser.getByteTimeDomainData(dataArray);
		analyser1.getByteFrequencyData(dataArray1);

		var count1 = 0;

		for (var i=0; i<dataArray1.length; i++) count1 += dataArray1[i];
	
		var avg1 = (count1/dataArray1.length)/100;

		var scale1 = radius * avg1;

		sphere1.scale.x = scale1;
		sphere1.scale.y = scale1;
		sphere1.scale.z = scale1;

		//analyser.getByteTimeDomainData(dataArray);
		analyser2.getByteFrequencyData(dataArray2);

		var count2 = 0;

		for (var i=0; i<dataArray2.length; i++) count2 += dataArray2[i];
	
		var avg2 = (count2/dataArray2.length)/100;

		var scale2 = radius * avg2;

		sphere2.scale.x = scale2;
		sphere2.scale.y = scale2;
		sphere2.scale.z = scale2;
	}

	draw();
}
catch(e)  {
	alert("Web Audio API not supported");
}
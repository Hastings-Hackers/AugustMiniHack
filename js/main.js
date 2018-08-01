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
camera.position.x = 1;
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
var sphere = new THREE.Mesh( geometry, material );

scene.add( sphere );

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

	var analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount; 
	var dataArray = new Uint8Array(bufferLength);

	var source = context.createBufferSource(); 

	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:8080/music/test.mp3', true);
	request.responseType = 'arraybuffer';
	request.onload = function(){
		context.decodeAudioData(request.response, function(buffer) {
			source.buffer = buffer;
		}, null);
	}
	request.send();

	source.connect(context.destination);
    source.connect(analyser);

	source.start(0);

	function draw() {
		requestAnimationFrame(draw);

		//analyser.getByteTimeDomainData(dataArray);
		analyser.getByteFrequencyData(dataArray);

		var count = 0;

		for (var i=0; i<dataArray.length; i++) count += dataArray[i];
	
		var avg = (count/dataArray.length)/100;

		var scale = radius * avg;

		sphere.scale.x = scale;
		sphere.scale.y = scale;
		sphere.scale.z = scale;
	}

	draw();
}
catch(e)  {
	alert("Web Audio API not supported");
}
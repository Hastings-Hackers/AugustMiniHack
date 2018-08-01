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

try
{
	// Create a instance of AudioContext interface
	window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
	var context = new AudioContext();

	var source = context.createBufferSource(); //this represents the audio source. We need to now populate it with binary data.

	//now retrieve some binary audio data from <audio>, ajax, input file or microphone and put it into a audio source object.
	//here we will retrieve audio binary data via AJAX
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:8080/music/test.mp3', true);
	request.responseType = 'arraybuffer'; //This asks the browser to populate the retrieved binary data in a array buffer
	request.onload = function(){
		//populate audio source from the retrieved binary data. This can be done using decodeAudioData function.
		//first parameter of decodeAudioData needs to be array buffer type. So from wherever you retrieve binary data make sure you get in form of array buffer type.
		context.decodeAudioData(request.response, function(buffer) {
				source.buffer = buffer;
		}, null);
	}
	request.send();

	//now we got context, audio source.
	//now lets connect the audio source to a destination(hardware to play sound).
	source.connect(context.destination);//destination property is reference the default audio device

	/*
		If we wanted to add any audio nodes then we need to add them in between audio source and destionation anytime dynamically.
	*/

	//now play the sound.
	source.start(0);
	}
catch(e) 
{
	alert("Web Audio API not supported");
}
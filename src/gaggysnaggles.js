

if ( ! Detector.webgl ) {
	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";
}

//
// declare globals & consts
//

var container, stats;

var camera, controls, scene, renderer;

var mesh;

var worldWidth = 128, worldDepth = 128,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2,

//
// procedurally generate map
//

data = generateHeight( worldWidth, worldDepth );

//
// initialize stuff
//

var clock = new THREE.Clock();

init();
animate();

//
//
//

function init() {
	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;

	controls = new THREE.FirstPersonControls( camera );

	controls.movementSpeed = 1000;
	controls.lookSpeed = 0.125;
	controls.lookVertical = true;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x0, 0.00015 );

	renderer = new THREE.WebGLRenderer({ clearColor: 0x0, antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );

	//
	// ground mesh & texture
	//

	var groundGeometry = createCube();

	groundGeometry.mergeVertices();
	groundGeometry.computeFaceNormals();
	groundGeometry.computeVertexNormals( true );

	var groundTexture = THREE.ImageUtils.loadTexture( 'textures/swirl/atlas.png' );
	
	groundTexture.magFilter = THREE.NearestFilter;
	groundTexture.minFilter = THREE.LinearMipMapLinearFilter;

	var ground = new THREE.Mesh(
		groundGeometry,
		new THREE.MeshLambertMaterial( { map: groundTexture, ambient: 0xbbbbbb } ) 
	);

	scene.add( ground );

	//
	// lighting
	//

	scene.add( new THREE.AmbientLight( 0xcccccc ) );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
	directionalLight.position.set( 1, 1, 0.5 ).normalize();
	scene.add( directionalLight );

	//
	// fps counter
	//

	container.innerHTML = "";

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	//
	// post processing
	//

	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	//var effectFilm = new THREE.FilmPass( 0.2, 0, 2048, false );
	//effectFilm.renderToScreen = true;

	var noiseFilter = new THREE.ShaderPass( THREE.RGBShiftShader );
	noiseFilter.uniforms[ 'amount' ].value = 0.0015;

	var effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );
	effectFilm.renderToScreen = true;

	var effectBloom = new THREE.BloomPass( 1, 25, 1.99 );

	var clearMask = new THREE.ClearMaskPass();

	composer.addPass(clearMask);
	composer.addPass(effectBloom);
	composer.addPass(effectFilm);
	composer.addPass(noiseFilter);
	

	//handle window resizing
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();
}

function getY( x, z ) {
	typeof window.xs == "undefined" ? window.xs = [x] : window.xs.push(x);

	return ( data[ x + z * worldWidth ] * 0.2 ) | 0;
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	renderer.clear();

	controls.update( clock.getDelta() );
	composer.render( clock.getDelta() );
	//renderer.render( scene, camera );
}


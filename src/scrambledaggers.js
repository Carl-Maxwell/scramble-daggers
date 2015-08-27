

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

window.worldWidth = 128;
window.worldDepth = 128,
window.worldHalfWidth = worldWidth / 2;
window.worldHalfDepth = worldDepth / 2;

window.character_height = h("2 blocks");

//
// procedurally generate map
//

// TODO should map be capitalized?

window.map = window.map || {};

map.heightmap = generateHeight( worldWidth, worldDepth );

map.getHeight = function(x, z) {
  x = round(x/h("1 block") + worldHalfWidth);
  z = round(z/h("1 block") + worldHalfDepth);

  // TODO why is this being multiplied by 0.2?

	return ((map.heightmap[x + z * worldWidth] * 0.2) | 0) * h("1 block");
}

map.getHeight_internal = function(x, z) {
	return (map.heightmap[x + z * worldWidth] * 0.2) | 0;
}

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
  camera.position.y = map.getHeight( 0, 0 ) + h("5 blocks");

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


	var ground = new THREE.Mesh(
		groundGeometry,
		new THREE.MeshPhongMaterial( { map: groundTexture, ambient: 0xbbbbbb } )
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

	var dpr = 1;
	if (window.devicePixelRatio !== undefined) {
		dpr = window.devicePixelRatio;
	}

	var fxaaFilter = new THREE.ShaderPass( THREE.FXAAShader );
	fxaaFilter.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
	fxaaFilter.renderToScreen = true;

	var noiseFilter = new THREE.ShaderPass( THREE.RGBShiftShader );
	noiseFilter.uniforms[ 'amount' ].value = 0.0015;

  var effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );
	//effectFilm.renderToScreen = true;

  var vignetteFilter = new THREE.ShaderPass( THREE.VignetteShader );
  vignetteFilter.renderToScreen = true;

	//var effectBloom = new THREE.BloomPass( 1, 25, 1.99 );

	var clearMask = new THREE.ClearMaskPass();

	//composer.addPass(clearMask);
	//composer.addPass(effectBloom);
	//composer.addPass(fxaaFilter);
	composer.addPass(effectFilm);
  composer.addPass(vignetteFilter);

	//composer.addPass(noiseFilter);


	//handle window resizing
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();
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


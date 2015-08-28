if ( ! Detector.webgl ) {
	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";
}

//
// declare globals & consts
//

var container, stats;

var camera, controls, scene, renderer;

var mesh, mat;

//
//
//

window.worldWidth = 128;
window.worldDepth = 128;
window.worldHalfWidth = worldWidth / 2;
window.worldHalfDepth = worldDepth / 2;

window.character_height = h("2 blocks");

//
// procedurally generate map
//

window.map = window.map || {};

map.heightmap = generateHeight( worldWidth, worldDepth );

map.getHeight = function(x, z) {
	x = round(x/h("1 block") + worldHalfWidth);
	z = round(z/h("1 block") + worldHalfDepth);

	// TODO why is this being multiplied by 0.2?

	return ((map.heightmap[x + z * worldWidth] * 0.2) | 0) * h("1 block");
};

map.getHeight_internal = function(x, z) {
	return (map.heightmap[x + z * worldWidth] * 0.2) | 0;
};

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

	controls.movementSpeed = 100;
	controls.lookSpeed = 0.125;
	controls.lookVertical = true;
	controls.constrainVertical = true;
	controls.verticalMin = 0.7;
	controls.verticalMax = 3;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xffffff, 0.00015 );

	//
	// ground mesh & texture
	//

	var groundGeometry = createCube();

	//groundGeometry.mergeVertices();
	//groundGeometry.computeFaceNormals();
	//groundGeometry.computeVertexNormals( true );

	var groundTexture = THREE.ImageUtils.loadTexture( 'textures/swirl/atlas.png' );

	groundTexture.magFilter = THREE.NearestFilter;
	groundTexture.minFilter = THREE.LinearMipMapLinearFilter;

	var ground = new THREE.Mesh(
		groundGeometry,
		new THREE.MeshLambertMaterial( { map: groundTexture, vertexColors: THREE.VertexColors } )
	);
	scene.add( ground );

	//
	// lighting
	//

	scene.add( new THREE.AmbientLight( 0xcccccc ) );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
	directionalLight.position.set( 1, 1, 0.5 ).normalize();
	scene.add( directionalLight );

	renderer = new THREE.WebGLRenderer({antialias: true}); // antialias: true
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

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
	controls.update( clock.getDelta() );
	renderer.render( scene, camera );
}

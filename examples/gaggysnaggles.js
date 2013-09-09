

if ( ! Detector.webgl ) {
	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";
}

var container, stats;

var camera, controls, scene, renderer;

var mesh;

var worldWidth = 128, worldDepth = 128,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2,
data = generateHeight( worldWidth, worldDepth );

console.log(data);

var clock = new THREE.Clock();

init();
animate();

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

	// sides

	var matrix = new THREE.Matrix4();

	var pxGeometry = new THREE.PlaneGeometry( 100, 100 );
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 3 ].y = 0.5;
	pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	pxGeometry.applyMatrix( matrix.makeTranslation( 50, 0, 0 ) );

	var nxGeometry = new THREE.PlaneGeometry( 100, 100 );
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 3 ].y = 0.5;
	nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
	nxGeometry.applyMatrix( matrix.makeTranslation( - 50, 0, 0 ) );

	var pyGeometry = new THREE.PlaneGeometry( 100, 100 );
	pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	pyGeometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );
	
	var nyGeometry = new THREE.PlaneGeometry( 100, 100 );
	nyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	nyGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	nyGeometry.applyMatrix( matrix.makeRotationX( Math.PI / 2 ) );
	nyGeometry.applyMatrix( matrix.makeTranslation( 0, -50, 0 ) );

	var pzGeometry = new THREE.PlaneGeometry( 100, 100 );
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 3 ].y = 0.5;
	pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 50 ) );

	var nzGeometry = new THREE.PlaneGeometry( 100, 100 );
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 3 ].y = 0.5;
	nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
	nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, -50 ) );

	var shipGeometry = new THREE.Geometry();
	var groundGeometry = new THREE.Geometry();
	var dummy = new THREE.Mesh();

	for ( var z = 0; z < worldDepth; z ++ ) {

		for ( var x = 0; x < worldWidth; x ++ ) {

			var h = getY( x, z );

			dummy.position.x = x * 100 - worldHalfWidth * 100;
			dummy.position.y = h * 100;
			dummy.position.z = z * 100 - worldHalfDepth * 100;

			var px = getY( x + 1, z );
			var nx = getY( x - 1, z );
			var pz = getY( x, z + 1 );
			var nz = getY( x, z - 1 );

			var mergeGeometries = function(pnGeometry) {
				dummy.geometry = pnGeometry;
				if (h > 0)
					THREE.GeometryUtils.merge(shipGeometry, dummy);
				else
					THREE.GeometryUtils.merge(groundGeometry, dummy);
			};
			
			mergeGeometries(pyGeometry);
			mergeGeometries(nyGeometry);

			//if ( ( px != h && px != h + 1 ) || x == 0 )
				mergeGeometries(pxGeometry);

			//if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 )
				mergeGeometries(nxGeometry);

			//if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 )
				mergeGeometries(pzGeometry);

			//if ( ( nz != h && nz != h + 1 ) || z == 0 ) 
				mergeGeometries(nzGeometry);


		}

	}

	//renderer = new THREE.WebGLDeferredRenderer( { width: window.innerWidth, height: window.innerHeight, scale: 1, antialias: true, tonemapping: THREE.FilmicOperator, brightness: 2.5 } );
	renderer = new THREE.WebGLRenderer({ clearColor: 0x0 });
	renderer.setSize( window.innerWidth, window.innerHeight );

	var shipTexture   = THREE.ImageUtils.loadTexture( 'textures/minecraft/swirl/tweed_scaled.png' ),
	    groundTexture = THREE.ImageUtils.loadTexture( 'textures/minecraft/swirl/atlas.png' );
	
	groundTexture.magFilter = THREE.NearestFilter;
	groundTexture.minFilter = THREE.LinearMipMapLinearFilter;
	
	shipTexture.magFilter = THREE.NearestFilter;
	shipTexture.minFilter = THREE.LinearMipMapLinearFilter;

	//groundTexture.anisotropy = renderer.getMaxAnisotropy();
	//shipTexture.anisotropy = renderer.getMaxAnisotropy();

	var ground = new THREE.Mesh( groundGeometry, new THREE.MeshLambertMaterial( { map: groundTexture, ambient: 0xbbbbbb } ) ),
	    ship   = new THREE.Mesh( shipGeometry, new THREE.MeshLambertMaterial( { map: shipTexture, ambient: 0xbbbbbb } ) );
	scene.add( ground );
	scene.add( ship   );

	var ambientLight = new THREE.AmbientLight( 0xcccccc );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
	directionalLight.position.set( 1, 1, 0.5 ).normalize();
	scene.add( directionalLight );

	container.innerHTML = "";

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	//
	//post processing
	//
	
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	//var effect = new THREE.ShaderPass( THREE.DotScreenShader );
	//effect.uniforms[ 'scale' ].value = 4;
	//composer.addPass( effect );

	//var effect = new THREE.ShaderPass( THREE.FilmShader );
	//effect.uniforms['aspect'].value = new THREE.Vector2( 512, 512 );
	//effect.renderToScreen = true;
	//composer.addPass( effect );

	var effectFilm = new THREE.FilmPass( 0.2, 0, 2048, false );
	effectFilm.renderToScreen = true;

	composer.addPass( effectFilm );

	//var effect = new THREE.ShaderPass( THREE.VignetteShader );
	
	//composer.addPass( effect );

	var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
	effect.uniforms[ 'amount' ].value = 0.0015;
	//effect.renderToScreen = true;
	composer.addPass( effect );

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



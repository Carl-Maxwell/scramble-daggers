//
// define a cube mesh
//

function createCube() {
	var light = new THREE.Color( 0xffffff );
	var shadow = new THREE.Color( 0x505050 );

	var matrix = new THREE.Matrix4();

	var pxGeometry = new THREE.PlaneGeometry( 100, 100 );
	pxGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
	pxGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	pxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	pxGeometry.applyMatrix( matrix.makeTranslation( 50, 0, 0 ) );

	var nxGeometry = new THREE.PlaneGeometry( 100, 100 );
	nxGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
	nxGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	nxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
	nxGeometry.applyMatrix( matrix.makeTranslation( - 50, 0, 0 ) );

	var pyGeometry = new THREE.PlaneGeometry( 100, 100 );
	pyGeometry.faces[ 0 ].vertexColors = [ light, light, light ];
	pyGeometry.faces[ 1 ].vertexColors = [ light, light, light ];
	pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
	pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	pyGeometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

	var py2Geometry = new THREE.PlaneGeometry( 100, 100 );
	py2Geometry.faces[ 0 ].vertexColors = [ light, light, light ];
	py2Geometry.faces[ 1 ].vertexColors = [ light, light, light ];
	py2Geometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
	py2Geometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

	var pzGeometry = new THREE.PlaneGeometry( 100, 100 );
	pzGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
	pzGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	pzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 50 ) );

	var nzGeometry = new THREE.PlaneGeometry( 100, 100 );
	nzGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
	nzGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	nzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
	nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, - 50 ) );

	var geometry = new THREE.Geometry();
	var dummy = new THREE.Mesh();

	for ( var z = 0; z < worldDepth; z ++ ) {

		for ( var x = 0; x < worldWidth; x ++ ) {

			var h = map.getHeight_internal( x, z );

			matrix.makeTranslation(
				x * 100 - worldHalfWidth * 100,
				h * 100,
				z * 100 - worldHalfDepth * 100
			);

			var px = map.getHeight_internal( x + 1, z );
			var nx = map.getHeight_internal( x - 1, z );
			var pz = map.getHeight_internal( x, z + 1 );
			var nz = map.getHeight_internal( x, z - 1 );

			var pxpz = map.getHeight_internal( x + 1, z + 1 );
			var nxpz = map.getHeight_internal( x - 1, z + 1 );
			var pxnz = map.getHeight_internal( x + 1, z - 1 );
			var nxnz = map.getHeight_internal( x - 1, z - 1 );

			var a = nx > h || nz > h || nxnz > h ? 0 : 1;
			var b = nx > h || pz > h || nxpz > h ? 0 : 1;
			var c = px > h || pz > h || pxpz > h ? 0 : 1;
			var d = px > h || nz > h || pxnz > h ? 0 : 1;

			if ( a + c > b + d ) {

				var colors = py2Geometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = b === 0 ? shadow : light;
				colors[ 1 ] = c === 0 ? shadow : light;
				colors[ 2 ] = a === 0 ? shadow : light;

				var colors = py2Geometry.faces[ 1 ].vertexColors;
				colors[ 0 ] = c === 0 ? shadow : light;
				colors[ 1 ] = d === 0 ? shadow : light;
				colors[ 2 ] = a === 0 ? shadow : light;

				geometry.merge( py2Geometry, matrix );

			} else {

				var colors = pyGeometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = a === 0 ? shadow : light;
				colors[ 1 ] = b === 0 ? shadow : light;
				colors[ 2 ] = d === 0 ? shadow : light;

				var colors = pyGeometry.faces[ 1 ].vertexColors;
				colors[ 0 ] = b === 0 ? shadow : light;
				colors[ 1 ] = c === 0 ? shadow : light;
				colors[ 2 ] = d === 0 ? shadow : light;

				geometry.merge( pyGeometry, matrix );

			}

			if ( ( px != h && px != h + 1 ) || x == 0 ) {

				var colors = pxGeometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = pxpz > px && x > 0 ? shadow : light;
				colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

				var colors = pxGeometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

				geometry.merge( pxGeometry, matrix );

			}

			if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 ) {

				var colors = nxGeometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = nxnz > nx && x < worldWidth - 1 ? shadow : light;
				colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

				var colors = nxGeometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

				geometry.merge( nxGeometry, matrix );

			}

			if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 ) {

				var colors = pzGeometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = nxpz > pz && z < worldDepth - 1 ? shadow : light;
				colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

				var colors = pzGeometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

				geometry.merge( pzGeometry, matrix );

			}

			if ( ( nz != h && nz != h + 1 ) || z == 0 ) {

				var colors = nzGeometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = pxnz > nz && z > 0 ? shadow : light;
				colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

				var colors = nzGeometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

				geometry.merge( nzGeometry, matrix );

			}

		}

	}

	return geometry;
}

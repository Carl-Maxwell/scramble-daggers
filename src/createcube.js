//
// define a cube mesh
//

function createCube() {
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

	var outputGeometry = new THREE.Geometry();
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
					THREE.GeometryUtils.merge(outputGeometry, dummy);
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

	return outputGeometry;
}
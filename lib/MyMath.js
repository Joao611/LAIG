crossProduct = function(a, b) {
	let x = a[1] * b[2] - a[2] * b[1];
	let y = -(a[0] * b[2] - a[2] * b[0]);
	let z = a[0] * b[1] - a[1] * b[0];
	return [x, y, z];
}
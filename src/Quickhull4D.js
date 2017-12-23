;(function() {

"use strict";

function Quickhull4D(points) {
  var p1 = new Vec4D(1,2,3,4);
  var p2 = new Vec4D(1,2,3,4);
  var p3 = new Vec4D(1,2,3,4);
  var p4 = new Vec4D(1,2,3,4);
  var facet = new Facet(p1, p2, p3, p4);
  console.log(facet);
}

function vecCross(U, V, W) {
  var A = (V.x * W.y) - (V.y * W.x);
  var B = (V.x * W.z) - (V.z * W.x);
  var C = (V.x * W.w) - (V.w * W.x);
  var D = (V.y * W.z) - (V.z * W.y);
  var E = (V.y * W.w) - (V.w * W.y);
  var F = (V.z * W.w) - (V.w * W.z);

  var result = new Vec4D(0,0,0,0);
  result.x =   (U.y * F) - (U.z * E) + (U.w * D);
  result.y = - (U.x * F) + (U.z * C) - (U.w * B);
  result.z =   (U.x * E) - (U.y * C) + (U.w * A);
  result.w = - (U.x * D) + (U.y * B) - (U.z * A);

  return result;
}

function vecSubtract(v1, v2) {
  return new Vec4D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
}

function Vec4D(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Object.assign(Vec4D.prototype, {
  equalTo: function(v) {
    return  this.x == v.x;
  }
});

function Facet(p0,p1,p2,p3){
	this.vertices = [p0,p1,p2,p3];

	this.edges = [
	[p0,p1],[p0,p2],[p0,p3],
	[p1,p2],[p1,p3],[p2,p3]
  ];

	this.ridges = [
		[p0,p1,p3],[p0,p2,p3],[p1,p2,p3],[p0,p1,p2]
	];

  var u = vecSubtract(this.vertices[1], this.vertices[0]);
  var v = vecSubtract(this.vertices[2], this.vertices[1]);
  var w = vecSubtract(this.vertices[3], this.vertices[2]);
  this.normal = vecCross(u, v, w);

  this.centroid = new Vec4D(0,0,0,0);

  for(var i=0;i<this.vertices.length;i++){
    var v = this.vertices[i];
    this.centroid.x += v.x;
    this.centroid.y += v.y;
    this.centroid.z += v.z;
    this.centroid.w += v.w;
  }
  this.centroid.x /= this.vertices.length;
  this.centroid.y /= this.vertices.length;
  this.centroid.z /= this.vertices.length;
  this.centroid.w /= this.vertices.length;

	this.outside_set = [];

  this.neighbors = [];
}

Object.assign( Facet.prototype, {
  computeCentroid: function() {
    this.centroid = new Vec4D;

  	for(var i=0;i<this.vertices.length;i++){
  		var v = this.vertices[i];
  		this.centroid.x += v.x;
  		this.centroid.y += v.y;
  		this.centroid.z += v.z;
  		this.centroid.w += v.w;
  	}
  	this.centroid.x /= this.vertices.length;
  	this.centroid.y /= this.vertices.length;
  	this.centroid.z /= this.vertices.length;
  	this.centroid.w /= this.vertices.length;
  },
  getHyperPlane: function(){
      var plane = new HyperPlane(this.normal,this.centroid);
      return plane;
  },
  isPointAbove: function(point){
    var plane = this.getHyperPlane();
    return plane.isPointAbove(point);
  },
  invertNormal: function(){
    this.normal.multiplyScalar(-1);
  }
})

function HyperPlane( normal, p0 ) {
  this.normal = normal;
  this.p0 = p0;
}

Object.assign( HyperPlane.prototype, {

  isPointAbove: function (point) {
    var diff = new THREE.Vector4().subVectors(point,this.p0);
    var dist = this.distanceToPoint(point);
    if(isNaN(dist)){
      return false;
    }
    return this.normal.dot(diff) >= 0;
  },

  distanceToPoint: function(point){
    var b = this.normal.dot(this.p0.clone().multiplyScalar(-1));
    return (Math.abs(this.normal.dot(point) + b)) / (this.normal.length());
  }
})

if( typeof exports !== 'undefined' ) {
	if( typeof module !== 'undefined' && module.exports ) {
		exports = module.exports = { Quickhull4D : Quickhull4D };
	}
	exports.Quickhull4D = Quickhull4D;
}
else {
	root.Quickhull4D = Quickhull4D;
}

}).call(this);

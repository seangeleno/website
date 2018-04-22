var canvas = document.querySelector('canvas');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

// Decrease to improve performance
var dotsAmount = 2300;

var colors = [
    new THREE.Color('#ffffff'),
    new THREE.Color('#4b4a47'),
    new THREE.Color('#fefdf9'),
    new THREE.Color('#e2e0d7'),
];

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor( 0x000000, 0 ); // the default

var scene = new THREE.Scene();

var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 20;


var camera = new THREE.PerspectiveCamera(55, width / height, 2, 400);
camera.position.set(0, 0, 300);
camera.enableDamping = true;
camera.minPolarAngle = 0.8;
camera.maxPolarAngle = 2.4;
camera.dampingFactor = 0.07;
camera.rotateSpeed = 0.07;

var galaxy = new THREE.Group();
scene.add(galaxy);

// Create dots
var loader = new THREE.TextureLoader();
loader.crossOrigin = null;

var dotTexture = loader.load(window.location.href+"/img/dotTexture.png");

var dotsGeometry = new THREE.Geometry();
var positions = new Float32Array(dotsAmount * 3);

var sizes = new Float32Array(dotsAmount);
var colorsAttribute = new Float32Array(dotsAmount * 3);
for (var i = 0; i < dotsAmount; i++) {
    var vector = new THREE.Vector3();

    vector.color = Math.floor(Math.random() * colors.length);
    vector.theta = Math.random() * Math.PI * 2;
    vector.phi =
        (1 - Math.sqrt(Math.random())) *
        Math.PI /
        2 *
        (Math.random() > 0.5 ? 1 : -1);

    vector.x = Math.cos(vector.theta) * Math.cos(vector.phi);
    vector.y = Math.sin(vector.phi);
    vector.z = Math.sin(vector.theta) * Math.cos(vector.phi);
    vector.multiplyScalar(110 + (Math.random() - 0.5) * 5);
    vector.scaleX = 6;

    if (Math.random() > 0.5) {
        moveDot(vector, i);
    }
    dotsGeometry.vertices.push(vector);
    vector.toArray(positions, i * 3);
    colors[vector.color].toArray(colorsAttribute, i*3);
    sizes[i] = 5;
}

function moveDot(vector, index) {
        var tempVector = vector.clone();
        tempVector.multiplyScalar((Math.random() - 0.5) * 0.3 + 1);
        TweenMax.to(vector, Math.random() * 3 + 3, {
            x: tempVector.x,
            y: tempVector.y,
            z: tempVector.z,
            yoyo: true,
            repeat: -1,
            delay: -Math.random() * 3,
            ease: Power0.easeNone,
            onUpdate: function () {
                attributePositions.array[index*3] = vector.x;
                attributePositions.array[index*3+1] = vector.y;
                attributePositions.array[index*3+2] = vector.z;
            }
        });
}

var bufferWrapGeom = new THREE.BufferGeometry();
var attributePositions = new THREE.BufferAttribute(positions, 3);
bufferWrapGeom.addAttribute('position', attributePositions);
var attributeSizes = new THREE.BufferAttribute(sizes, 1);
bufferWrapGeom.addAttribute('size', attributeSizes);
var attributeColors = new THREE.BufferAttribute(colorsAttribute, 3);
bufferWrapGeom.addAttribute('color', attributeColors);
var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        texture: {
            value: dotTexture
        }
    },
    vertexShader: document.getElementById("wrapVertexShader").textContent,
    fragmentShader: document.getElementById("wrapFragmentShader").textContent,
    transparent:true
});
var wrap = new THREE.Points(bufferWrapGeom, shaderMaterial);
scene.add(wrap);

// Create white segments
var segmentsGeom = new THREE.Geometry();
var segmentsMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    vertexColors: THREE.VertexColors
});
for (i = dotsGeometry.vertices.length - 1; i >= 0; i--) {
    vector = dotsGeometry.vertices[i];
    for (var j = dotsGeometry.vertices.length - 1; j >= 0; j--) {
        if (i !== j && vector.distanceTo(dotsGeometry.vertices[j]) < 12) {
            segmentsGeom.vertices.push(vector);
            segmentsGeom.vertices.push(dotsGeometry.vertices[j]);
            segmentsGeom.colors.push(colors[vector.color]);
            segmentsGeom.colors.push(colors[vector.color]);
        }
    }
}
var segments = new THREE.LineSegments(segmentsGeom, segmentsMat);
galaxy.add(segments);

var hovered = [];
var prevHovered = [];
function render(a) {
    var i;
    dotsGeometry.verticesNeedUpdate = true;
    segmentsGeom.verticesNeedUpdate = true;
    
    raycaster.setFromCamera( mouse, camera );
    var intersections = raycaster.intersectObjects([wrap]);
    hovered = [];
    if (intersections.length) {
        for(i = 0; i < intersections.length; i++) {
            var index = intersections[i].index;
            hovered.push(index);
            if (prevHovered.indexOf(index) === -1) {
                onDotHover(index);
            }
         }
    }
    for(i = 0; i < prevHovered.length; i++){
        if(hovered.indexOf(prevHovered[i]) === -1){
            mouseOut(prevHovered[i]);
        }
    }
    prevHovered = hovered.slice(0);
    attributeSizes.needsUpdate = true;
    attributePositions.needsUpdate = true;
    renderer.render(scene, camera);
}

function onDotHover(index) {
    dotsGeometry.vertices[index].tl = new TimelineMax();
    dotsGeometry.vertices[index].tl.to(dotsGeometry.vertices[index], 1, {
        scaleX: 7,
        ease: Elastic.easeOut.config(4, 0.6),
        onUpdate: function() {
            attributeSizes.array[index] = dotsGeometry.vertices[index].scaleX;
        }
    });
}

function mouseOut(index) {
    dotsGeometry.vertices[index].tl.to(dotsGeometry.vertices[index], 0.4, {
        scaleX: 5,
        ease: Power2.easeOut,
        onUpdate: function() {
            attributeSizes.array[index] = dotsGeometry.vertices[index].scaleX;
        }
    });
}

function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

var mouse = new THREE.Vector2(-100,-100);

var angle = 0;
var radius =0.5;

var rotSpeed = 1;
var x = camera.position.x,
    y = camera.position.y,
    z = camera.position.z;



var enterX ;
function onMouseEnter(e){
    enterX = e.clientX;
}
var scrollArea =  window.innerHeight;

function onMouseMove(e) {
    var canvasBounding = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - canvasBounding.left) / width) * 2 - 1;
    mouse.y = -((e.clientY - canvasBounding.top) / height) * 2 + 1;

    last_post = e.clientX;

    var scrollTop = window.pageYOffset || window.scrollTop;
    if( e.clientY < scrollArea) {
        camera.position.z = z * Math.cos(e.clientY / -3000) - y * Math.sin(rotSpeed);
        camera.lookAt(scene.position);
    }

}


function onScroll(){
    var canvasBounding = canvas.getBoundingClientRect();

    var scrollTop = window.pageYOffset || window.scrollTop;
    var scrollPercent = scrollTop/scrollArea || 0;

    //console.log(y,scrollArea,scrollTop)
    if( scrollTop > 5 && scrollTop < scrollArea){
        camera.position.y =  (scrollTop/2) ;
        camera.lookAt(scene.position);
    }else{
        camera.position.y =  y ;
        camera.lookAt(scene.position);
    }

}


function onMouseOut() {

}

TweenMax.ticker.addEventListener("tick", render);

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseover", onMouseEnter);
window.addEventListener("mouseout", onMouseOut);
window.addEventListener("scroll", onScroll);

var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});




















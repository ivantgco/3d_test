/**
 * Created by igoptarev on 26.07.2015.
 */

$(document).ready(function(){
    var scene, camera, render;
    var loader, chair_geometry;
    var control;

    var W = parseInt(window.innerWidth);
    var H = parseInt(window.innerHeight);


    container = document.createElement( 'div' );
    document.body.appendChild( container );


    scene = new THREE.Scene();

    //

    camera = new THREE.PerspectiveCamera( 45, W / H, 1, 100000 );
    //camera.position.z = 200;
    //camera.position.x = 200;
    //camera.position.y = 200;
    camera.position.set(0,50,200);
    control = new THREE.TrackballControls(camera);
    control.addEventListener('change', renderFunc);



    var light = new THREE.SpotLight();
    light.position.set(0,1000,100);
    light.castShadow = true;
    scene.add(light);
    var plane_texture = THREE.ImageUtils.loadTexture('./img/texture2.jpg');

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(400,400,10,10), new THREE.MeshLambertMaterial({map:plane_texture}));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);
    var cube_texture = THREE.ImageUtils.loadTexture('./img/texture1.jpg');

    var chair;
    var chair_group = new THREE.Object3D();
    loader = new THREE.BufferGeometryLoader();

    var sphere = new THREE.Mesh(new THREE.SphereGeometry(200), new THREE.MeshLambertMaterial({map:cube_texture,side: THREE.BackSide}));
    scene.add(sphere);

    var box1, box2;
    var chair_rotation = Math.PI / 4 -0.1;
    var chair_load = function(geometry  ){
        var x, y,z;
        for (var r = 10; r>0;r--){
            z = -r*10;
            y = r*2 - 2;
            box1 = new THREE.Mesh(new THREE.CubeGeometry(105,y,20), new THREE.MeshLambertMaterial({color:0x120605}));
            box1.position.set(-62.5,(y/2)+0.1,z);
            for (var l1 = 10; l1>0;l1--){
                x = -l1 * 10 - 10;

                chair = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color:0xff0000} ));
                chair.scale.set(0.08,0.08,0.08);
                chair.rotation.y = chair_rotation;
                chair.position.y =  r*2 - 2;
                chair.position.x = x;
                chair.position.z = z;
                chair_group.add(chair);
            }
            for (var l2 = 10; l2>0;l2--){
                x = -l2 * 10 + 110;

                chair = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color:0xff0000} ));
                chair.scale.set(0.08,0.08,0.08);
                chair.rotation.y = chair_rotation;
                chair.position.y = y;
                chair.position.x = x;
                chair.position.z = z;
                chair_group.add(chair);
            }
            chair_group.add(box1);
        }

        scene.add(chair_group);
        render.render(scene, camera);

    };
    loader.load('./models/chair_geometry2.json',chair_load);
    //var cube0 = new THREE.Mesh(new THREE.CubeGeometry(1,1,1), new THREE.MeshLambertMaterial({map:cube_texture}));
    //cube0.position.y = 0.5;
    //scene.add(cube0);

    render = new THREE.WebGLRenderer( { antialias: true } );
    //render.shadowMapEnabled = true;
    render.setSize( W, H );
    render.setClearColor(0xA7B0C4,1);
    //render.setClearColorHex(0x000000,1);
    container.appendChild( render.domElement );

    var angle = 0;
    var animated = true;
    function animate(){
        requestAnimationFrame(animate);
        //if (!animated) return;
        control.update();
        //camera.position.x = 400* Math.sin(angle);
        //camera.position.z = 400* Math.cos(angle);
        //angle += Math.PI/180 * 0.5;
        //camera.lookAt(cube0.position);
        //render.render(scene,camera);
    }
    function renderFunc(){
        render.render(scene,camera);
    }
    animate();
    animated = false;
   /* $('canvas').on('click',function(e){
        animated = !animated;
    });*/

});



/**
 * Created by igoptarev on 26.07.2015.
 */

var fixEvent = function (e) {

    // получить объект событие для IE
    e = e || window.event;
    var t = e.target || e.srcElement;
    //var l = $(t).parents(".modal-content-wrapper").length;
    var modal = $(t).parents(".modal-content-wrapper");
    // добавить pageX/pageY для IE
    if (e.pageX == null && e.clientX != null) {
        var html = document.documentElement;
        var body = document.body;
        e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
        e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
    }
    //if (modal.length > 0 && modal.css("position")=="absolute"){
    //log($(t).offset().left);

    e.pageX -= $(t).offset().left;///* + parseInt($(t).css("borderWidth"))*/-$("body").scrollLeft();
    e.pageY -= $(t).offset().top;///* + parseInt($(t).css("borderWidth"))*/ -$("body").scrollTop();

    //}

    // добавить which для IE
    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) )
    }

    return e;
};


$(document).ready(function(){
    var scene, camera, render;
    var loader, chair_geometry;
    var control;

    var W = parseInt(window.innerWidth);
    var H = parseInt(window.innerHeight);


    var container = document.createElement( 'div' );
    container.setAttribute('id','renderContainer');
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


    var objects = [];
    var mouse = new THREE.Vector2();
    //var projector = new THREE.Projector();
    function onDocumentMouseMove(event){
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }
    function onDocumentMouseDown(event){
        //mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        //mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    }
    var colorNorm = new THREE.Color(0xff0000);
    var colorHover = new THREE.Color(0xcccccc);
    function onKeyMouseOver(){
        var  vector =  new THREE.Vector3(mouse.x, mouse.y, 0.5);
        //projector.unprojectVector(vector, camera);
        vector.unproject(camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects( objects );

        if (intersects.length > 0){
            //console.log(intersects[0]);
            for (var i in objects) {
                objects[i].material.color = colorNorm;
            }
            intersects[0].object.material.color = colorHover;
            //intersects[0].object.color = 0xff0000;
            //intersects[0].object.color = 0xcccccc;
            //intersects[0].object.scale.x = 0.005;
            //intersects[0].object.scale.y = 0.005;
            //intersects[0].object.scale.z = 0.005;

            //for (var i in intersects) {
            //    intersects[i].object.scale.x = 0.02;
            //    intersects[i].object.scale.y = 0.02;
            //    intersects[i].object.scale.z = 0.02;
            //}

            render.render(scene,camera);
            console.log('Куда то попал');
        }

    }
    //var setHandlers = function () {
    //    $('#renderContainer').off('click').on('click', function (e) {
    //        console.log('clicked');
    //        e = self.fixEvent(e);
    //        var x = e.pageX;
    //        var y = e.pageY;
    //
    //
    //    });
    //};
    //setHandlers();

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
    //scene.add(sphere);

    var box1, box2;
    //var chair_rotation = Math.PI / 4 -0.1;
    var chair_rotation = 0;
    var chair_load = function(geometry  ){

        var x, y,z;
        for (var r = 10; r>0;r--){
            z = -r*10;
            y = r*2 - 2;
            y = 0;
            box1 = new THREE.Mesh(new THREE.CubeGeometry(105,y,20), new THREE.MeshLambertMaterial({color:0x120605}));
            box1.position.set(-62.5,(y/2)+0.1,z);
            for (var l1 = 10; l1>0;l1--){
                x = -l1 * 10 - 10;
                var color = 0xff0000;
                if (r == 5 && l1 > 2 && l1 < 6) color = 0xcccccc;
                //chair = new THREE.Mesh(new THREE.CubeGeometry(4,4,4), new THREE.MeshLambertMaterial( {color:color} ));
                chair = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color:color} ));
                chair.scale.set(0.01,0.01,0.01);
                chair.rotation.y = chair_rotation;
                chair.position.y =  r*2 - 2;
                chair.position.x = x;
                chair.position.z = z;
                chair_group.add(chair);
                objects.push(chair);
            }
            for (var l2 = 10; l2>0;l2--){
                x = -l2 * 10 + 110;

                chair = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color:0xff0000} ));
                chair.scale.set(0.01,0.01,0.01);
                //chair = new THREE.Mesh(new THREE.CubeGeometry(4,4,4), new THREE.MeshLambertMaterial( {color:0x120605} ));
                chair.rotation.y = chair_rotation;
                chair.position.y = y;
                chair.position.x = x;
                chair.position.z = z;
                chair_group.add(chair);
                objects.push(chair);
            }
            // chair_group.add(box1);

        }

        scene.add(chair_group);
        render.render(scene, camera);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);

    };
    loader.load('./models/chair_geometry3.json',chair_load);
    //loader.load('./models/chair.json',chair_load);
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
        onKeyMouseOver();
        control.update();
        //camera.position.x = 400* Math.sin(angle);
        //camera.position.z = 400* Math.cos(angle);
        //angle += Math.PI/180 * 0.5;
        //camera.lookAt(cube0.position);
        render.render(scene,camera);
    }
    function renderFunc(){
        render.render(scene,camera);
    }
    animate();
    animated = false;
    $('canvas').on('click',function(e){
        // animated = !animated;
    });

});



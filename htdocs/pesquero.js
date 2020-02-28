   var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
       default: 'arcade',
       arcade: {
           fps: 60,
          gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create, 
		update: update 
    }
};

var wsocket = new WebSocket("ws://192.168.1.43:8080/servidor/Servidor");
var barco;
var cursors;
var weapon, weaponBullets;
var fireButton;
var pesquero1Habilitado = true;
var pesquero2Habilitado = false;
var pesquero3Habilitado = false;
var pesquero4Habilitado = false;
//var explosion;
var helicoptero;
var game = new Phaser.Game(config);
var timedEvent;
var boom;
var score = 0;
var cantPeces = 100;
//var radarBarco;
//var moveShape;
var radarBarco;
var radarBarco2;
var radarHelicoptero;
//var rectangle;
var graphics;




function preload ()
{
    this.load.image('bk_water2', 'recursos/bk_water2.jpg');
	this.load.image('frontera', 'recursos/frontera.png');
	this.load.image('costa', 'recursos/costa.png');
	this.load.image('lancha', 'recursos/lancha.png');
    this.load.image('barco', 'recursos/barco.png');
	this.load.image('barco2', 'recursos/barco2.png');
	this.load.image('pesquero1', 'recursos/pesquero1.png');
	this.load.image('pesquero2', 'recursos/pesquero2.png');
	this.load.image('bullet', 'recursos/shmup-bullet.png');
	this.load.image('balametralleta', 'recursos/balametralleta.png');
	this.load.image('green', 'recursos/green.png');
	this.load.image('yellow', 'recursos/yellow.png');
	this.load.image('red', 'recursos/red.png');
	
	
	
	
	this.load.scenePlugin('WeaponPlugin', 'WeaponPlugin.js', 'weaponPlugin', 'weapons');
	//this.load.image('explosion', 'recursos/explosion.gif');
	this.load.image('helicoptero', 'recursos/helicoptero.png');
	//this.load.spritesheet('explosion', 'recursos/explode.png', { frameWidth: 128, frameHeight: 128 });
//	this.load.image('radarBarco','recuros/radarBarco.png');
	
 this.load.spritesheet('explosion', 'recursos/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
}


function escribirEnPantalla(texto) {
	var parrafo = document.createElement("p");
	
	parrafo.style.wordWrap = "break-word";
	parrafo.innerHTML(texto);
	output.appendChild(parrafo);
}	// escribirEnPantalla

function onMessage(evt) {
	text.setText("Mensaje recibido: " + evt.data);
}

wsocket.onmessage = function (evt) { onMessage(evt) };
	
function create ()
{	
	this.add.image(400, 300, 'bk_water2');
	this.add.image(400, 300, 'frontera');
	costa = this.physics.add.staticGroup();
	costa.create(400, 590, 'costa');
	lancha = this.physics.add.image(350, 550, 'lancha');
    barco = this.physics.add.image(350, 350, 'barco');
	barco2 = this.physics.add.image(450, 550, 'barco2');
	pesquero1 = this.physics.add.image(350, 50, 'pesquero1');
	pesquero2 = this.physics.add.image(450, 50, 'pesquero2');
	pesquero3 = this.physics.add.image(350, 100, 'pesquero1');
	pesquero4 = this.physics.add.image(450, 100, 'pesquero2');
	red1 = this.physics.add.image(350, 50, 'red');
	red2 = this.physics.add.image(450, 50, 'red');
	red3 = this.physics.add.image(350, 100, 'red');
	red4 = this.physics.add.image(450, 100, 'red');
	yellow1 = this.physics.add.image(350, 50, 'yellow');
	yellow2 = this.physics.add.image(450, 50, 'yellow');
	yellow3 = this.physics.add.image(350, 100, 'yellow');
	yellow4 = this.physics.add.image(450, 100, 'yellow');
	green1 = this.physics.add.image(350, 50, 'green');
	green2 = this.physics.add.image(450, 50, 'green');
	green3 = this.physics.add.image(350, 100, 'green');
	green4 = this.physics.add.image(450, 100, 'green');
	
	
	helicoptero=this.physics.add.image(100, 520, 'helicoptero');

	text1 = this.add.text(10, 10, '', { font: '16px Courier', fill: '#ffffff' });
	text2 = this.add.text(10, 300, '', { font: '16px Courier', fill: '#ffffff' });
	text3 = this.add.text(10, 400, '', { font: '16px Courier', fill: '#ffffff' });
	
	textCantPeces = this.add.text(600, 60, 'Peces: ' + cantPeces , {  fontSize: '20px', fill: '#000' });
	scoreText = this.add.text(600, 32, 'Puntuación: 0', { fontSize: '20px', fill: '#000' });
	
	
	//radarbarco1
	graphics = this.add.graphics();
    radarBarco = new Phaser.Geom.Circle(barco.x, barco.y, 100);
		
	//radarbarco2
	 radarBarco2 = new Phaser.Geom.Circle(barco2.x, barco2.y, 50);
	 
	 //radarHelicoptero
	 radarHelicoptero = new Phaser.Geom.Circle(barco.x, barco.y, 200);
	 
	 //radarLancha
	 radarLancha = new Phaser.Geom.Circle(barco.x, barco.y, 30);
	
	//cantidad de avisos restantes a los pesqueros
	cantAvisosP1 = 300;
	cantAvisosP2 = 300;
	cantAvisosP3 = 300;
	cantAvisosP4 = 300;

//explosion
var explotar = {
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23, first: 23 }),
        frameRate: 20
    };

    this.anims.create(explotar);

	energiaPesquero1 = 10;
	energiaPesquero2 = 10;
	energiaPesquero3 = 10;
	energiaPesquero4 = 10;

	
	
	//textCantPeces = this.add.text(600, 60, 'Peces: ' + cantPeces , {  fontSize: '20px', fill: '#000' });
	textEnergia1 = this.add.text(600, 120, 'Energia: ' + energiaPesquero1 , {  fontSize: '20px', fill: '#000' });
	
	
//	this.initialTime = 150; // 2:30 in seconds
	
	//text = this.add.text(32, 32, 'Countdown: ' + formatTime(this.initialTime));
//	text = this.add.text(20, 32, 'Tiempo: ', { fontSize: '20px', fill: '#000' });
	
    // Each 1000 ms call onEvent
  //  timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
	
	//  Creates 30 bullets, using the 'bullet' graphic
    weapon = this.add.weapon(30, 'bullet');
	
	//  Creates 30 bullets, using the 'bullet' graphic
    metralleta1 = this.add.weapon(30, 'balametralleta');
	metralleta2 = this.add.weapon(30, 'balametralleta');
	
    //  The bullet will be automatically killed when it leaves the world bounds
    // weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
	weapon.bulletSpeed = 100;
	metralleta1.bulletSpeed = 500;
	metralleta2.bulletSpeed = 500;
    
	//  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 1000;
	metralleta1.fireRate = 100;
	metralleta2.fireRate = 100;
	
	weaponBullets = weapon.bullets;
	metralleta1Bullets = metralleta1.bullets;
	metralleta2Bullets = metralleta2.bullets;
	
    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    weapon.trackSprite(barco, 0, 0, true);
	metralleta1.trackSprite(barco, 0, 0, true);
	metralleta2.trackSprite(barco2, 0, 0, true);

	
	
	
	
	
	barco.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	barco2.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	lancha.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	helicoptero.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	pesquero1.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	pesquero2.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	pesquero3.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	pesquero4.setCollideWorldBounds(true);<!-- colisiona con los limites del mundo-->
	
	this.physics.add.collider(barco, costa);
	this.physics.add.collider(barco2, costa);
	this.physics.add.collider(lancha, costa);
	this.physics.add.collider(pesquero1, costa);
	this.physics.add.collider(pesquero2, costa);
	this.physics.add.collider(pesquero3, costa);
	this.physics.add.collider(pesquero4, costa);
	this.physics.add.collider(barco, lancha);
	this.physics.add.collider(barco2, lancha);
	this.physics.add.collider(barco, pesquero1);
	this.physics.add.collider(barco2, pesquero1);
	this.physics.add.collider(lancha, pesquero1);
	this.physics.add.collider(barco, pesquero2);
	this.physics.add.collider(barco2, pesquero2);
	this.physics.add.collider(lancha, pesquero2);
	this.physics.add.collider(barco, pesquero3);
	this.physics.add.collider(barco2, pesquero3);
	this.physics.add.collider(lancha, pesquero3);
	this.physics.add.collider(barco, pesquero4);
	this.physics.add.collider(barco2, pesquero4);
	this.physics.add.collider(lancha, pesquero4);
	this.physics.add.collider(pesquero1, pesquero2);
	this.physics.add.collider(pesquero1, pesquero3);
	this.physics.add.collider(pesquero1, pesquero4);
	this.physics.add.collider(pesquero2, pesquero3);
	this.physics.add.collider(pesquero2, pesquero4);
	this.physics.add.collider(pesquero3, pesquero4);
	this.physics.add.collider(barco, barco2);
//	this.physics.add.collider(barco, weapon.bullets);
//	this.physics.add.collider(barco2, weapon.bullets);
	
    barco.setDamping(true);
    barco.setDrag(0.99);
    barco.setMaxVelocity(20);
	
    barco2.setDamping(true);
    barco2.setDrag(0.99);
    barco2.setMaxVelocity(40);
	
	lancha.setDamping(true);
    lancha.setDrag(0.99);
    lancha.setMaxVelocity(60);
		
	helicoptero.setDamping(true);
    helicoptero.setDrag(0.99);
    helicoptero.setMaxVelocity(80);
	
	pesquero1.setDamping(true);
    pesquero1.setDrag(0.99);
    pesquero1.setMaxVelocity(40);
	
	pesquero2.setDamping(true);
    pesquero2.setDrag(0.99);
    pesquero2.setMaxVelocity(20);
	
	pesquero3.setDamping(true);
    pesquero3.setDrag(0.99);
    pesquero3.setMaxVelocity(40);
	
	pesquero4.setDamping(true);
    pesquero4.setDrag(0.99);
    pesquero4.setMaxVelocity(20);

//   cursors = this.input.keyboard.createCursorKeys();
//	keyObj1 = this.input.keyboard.addKey('one');  // Get key object
//	keyObj2 = this.input.keyboard.addKey('two');  // Get key object
//	keyObj3 = this.input.keyboard.addKey('three');
//	keyObj4 = this.input.keyboard.addKey('four');
//	
	
	//cambio de asignacion de teclas para que no se tranque
	cursors = this.input.keyboard.createCursorKeys();
	teclaPesquero1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
	teclaPesquero2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
	teclaPesquero3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
	teclaPesquero4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
	
	
	
	
	
  //  text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
	
		
	
	
  }

function formatTime(seconds){
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}


function onEvent ()
{
   // this.initialTime -= 1; // One second
   // text.setText('Tiempo: ' + formatTime(this.initialTime));
}

function seleccionBarco ()
{
	if (teclaPesquero1.isDown && pesquero1.body.enable)
	{	
		pesquero1Habilitado = true;
		pesquero2Habilitado = false;
		pesquero3Habilitado = false;
		pesquero4Habilitado = false;
	}
	
	if (teclaPesquero2.isDown && pesquero2.body.enable)
	{
		pesquero1Habilitado = false;
		pesquero2Habilitado = true;
		pesquero3Habilitado = false;
		pesquero4Habilitado = false;
	}
	
	if (teclaPesquero3.isDown && pesquero3.body.enable)
	{
		pesquero1Habilitado = false;
		pesquero2Habilitado = false;
		pesquero3Habilitado = true;
		pesquero4Habilitado = false;
	}
	
	if (teclaPesquero4.isDown && pesquero4.body.enable)
	{
		pesquero1Habilitado = false;
		pesquero2Habilitado = false;
		pesquero3Habilitado = false;
		pesquero4Habilitado = true;
	}

}

function pescar ()
{
	if (pesquero1.y>300)
		cantPeces--;
	if (pesquero3.y>300)
		cantPeces--;
	if (pesquero2.y>300 && pesquero2.body.acceleration.x == 0 && pesquero2.body.acceleration.y == 0)
		cantPeces--;
	if (pesquero4.y>300 && pesquero4.body.acceleration.x == 0 && pesquero4.body.acceleration.y == 0)
		cantPeces--;
	
}




	
function update (time,delta)
{

	graphics.clear();// para que no genere el strokeCircle
	
	seleccionBarco ();
	
	pescar();
	textCantPeces.setText('Peces: ' + cantPeces);
	
	// movimientos
	green1.setPosition (pesquero1.x, pesquero1.y);
	yellow1.setPosition (pesquero1.x, pesquero1.y);
	red1.setPosition (pesquero1.x, pesquero1.y);
	green2.setPosition (pesquero2.x, pesquero2.y);
	yellow2.setPosition (pesquero2.x, pesquero2.y);
	red2.setPosition (pesquero2.x, pesquero2.y);
	green3.setPosition (pesquero3.x, pesquero3.y);
	yellow3.setPosition (pesquero3.x, pesquero3.y);
	red3.setPosition (pesquero3.x, pesquero3.y);
	green4.setPosition (pesquero4.x, pesquero4.y);
	yellow4.setPosition (pesquero4.x, pesquero4.y);
	red4.setPosition (pesquero4.x, pesquero4.y);
	
	
	
	if (pesquero1Habilitado)
	{			
		if (cursors.up.isDown)
		{
			this.physics.velocityFromRotation(pesquero1.rotation, 20, pesquero1.body.acceleration);
		}
		else
		{
			pesquero1.setAcceleration(0);
		}

		if (cursors.left.isDown)
		{
			pesquero1.setAngularVelocity(-20);
			
		}
		else if (cursors.right.isDown)
		{
			pesquero1.setAngularVelocity(20);
		}
		else
		{
			pesquero1.setAngularVelocity(0);
		}
	}
	
	if (pesquero2Habilitado)
	{
		if (cursors.up.isDown)
		{
			this.physics.velocityFromRotation(pesquero2.rotation, 20, pesquero2.body.acceleration);
		}
		else
		{
			pesquero2.setAcceleration(0);
		}

		if (cursors.left.isDown)
		{
			pesquero2.setAngularVelocity(-20);
			
		}
		else if (cursors.right.isDown)
		{
			pesquero2.setAngularVelocity(20);
		}
		else
		{
			pesquero2.setAngularVelocity(0);
		}
	}
	
	if (pesquero3Habilitado)
	{
		if (cursors.up.isDown)
		{
			this.physics.velocityFromRotation(pesquero3.rotation, 20, pesquero3.body.acceleration);
		}
		else
		{
			pesquero3.setAcceleration(0);
		}

		if (cursors.left.isDown)
		{
			pesquero3.setAngularVelocity(-20);
			
		}
		else if (cursors.right.isDown)
		{
			pesquero3.setAngularVelocity(20);
		}
		else
		{
			pesquero3.setAngularVelocity(0);
		}
	}
	
	if (pesquero4Habilitado)
	{			
		if (cursors.up.isDown)
		{
			this.physics.velocityFromRotation(pesquero4.rotation, 20, pesquero4.body.acceleration);
		}
		else
		{
			pesquero4.setAcceleration(0);
		}

		if (cursors.left.isDown)
		{
			pesquero4.setAngularVelocity(-20);
			
		}
		else if (cursors.right.isDown)
		{
			pesquero4.setAngularVelocity(20);
		}
		else
		{
			pesquero4.setAngularVelocity(0);
		}
	}
	
	if (!pesquero1Habilitado)
	{
		pesquero1.setAcceleration(0);
		pesquero1.setAngularVelocity(0);	
	}
	
	if (!pesquero2Habilitado)
	{
		pesquero2.setAcceleration(0);
		pesquero2.setAngularVelocity(0);	
	}
	
	if (!pesquero3Habilitado)
	{
		pesquero3.setAcceleration(0);
		pesquero3.setAngularVelocity(0);	
	}
	
	if (!pesquero4Habilitado)
	{
		pesquero4.setAcceleration(0);
		pesquero4.setAngularVelocity(0);	
	}
	
   //text.setText('Speed: ' + barco.body.speed);

   

 // this.physics.world.wrap(barco, 32);
//	this.physics.world.wrap(barco2, 32);

  // bk_water2.forEachExists(screenWrap, this);
//	function choquebarco1barco2 (barco, barco2)
//	{
//		barco2.disableBody(true, true);
//		boom = this.add.sprite(barco2.x, barco2.y, 'explosion');
//		boom.anims.play('explode');
//	}
//	this.physics.add.overlap(barco, barco2, choquebarco1barco2, null, this);
	
	//setTimeout(avisoPesquero1,5000,);
	text3.setText([
        'Cantidad de avisos: ' + cantAvisosP1
    ]);
	
	
	
	// cambios de color pesqueros
	
	if (cantAvisosP1>1 && cantAvisosP1<299)	
		green1.disableBody (true, true);

	if (cantAvisosP1<=1)
		yellow1.disableBody (true, true);

	
	text1.setText([
        'Sprite Rotation',
        'Angle: ' + barco.angle.toFixed(2),
        'Rotation: ' + barco.rotation.toFixed(2), 
		'barcox: ' + barco.x.toFixed(2),
		'barcoy: ' + barco.y.toFixed(2),
		'presquero1x: ' + pesquero1.x.toFixed(2),
		'presquero1y: ' + pesquero1.y.toFixed(2),
    ]);
	
	
	//text = this.add.text(10, 10, barco.rotation.toFixed(2), { font: '16px Courier', fill: '#00ff00' });
	
	if(Math.sqrt(Math.pow((pesquero1.x - barco.x),2) + Math.pow((pesquero1.y - barco.y),2))<=100)	
		{
		text2.setText([
        'dentro de rango ' + (Math.sqrt(Math.pow((pesquero1.x - barco.x),2) + Math.pow((pesquero1.y - barco.y),2))).toFixed(2)
    ]);
	}
	else
	{
	text2.setText([
        'fuera de rango ' + (Math.sqrt(Math.pow((pesquero1.x - barco.x),2) + Math.pow((pesquero1.y - barco.y),2))).toFixed(2)
    ]);
	}
	

	
	
}


function render() {

    weapon.debug();

}

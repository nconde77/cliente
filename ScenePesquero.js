class ScenePesquero extends Phaser.Scene {
  constructor() {
    super("playPesquero");
  }

	
	preload (){
		this.load.scenePlugin('WeaponPlugin', 'WeaponPlugin.js', 'weaponPlugin', 'weapons');

	}


  create() {
	
	this.wsocket = new WebSocket("ws://192.168.1.48:8080/servidor/Servidor");
	this.add.image(400, 300, 'bk_water2');
	this.add.image(400, 300, 'frontera');
	var costa = this.physics.add.staticGroup();
	costa.create(400, 590, 'costa');
	this.lancha = this.physics.add.image(350, 350, 'lancha');
	this.barco = this.physics.add.image(350, 350, 'barco');
    this.barco2 = this.physics.add.image(450, 550, 'barco2');
	this.helicoptero=this.physics.add.image(350, 350, 'helicoptero');
	this.pesquero1 = this.physics.add.image(350, 50, 'pesquero1');
	this.pesquero2 = this.physics.add.image(450, 50, 'pesquero2');
	this.pesquero3 = this.physics.add.image(350, 100, 'pesquero1');
	this.pesquero4 = this.physics.add.image(450, 100, 'pesquero2');
	this.red1 = this.physics.add.image(350, 50, 'red');
	this.red2 = this.physics.add.image(450, 50, 'red');
	this.red3 = this.physics.add.image(350, 100, 'red');
	this.red4 = this.physics.add.image(450, 100, 'red');
	this.yellow1 = this.physics.add.image(350, 50, 'yellow');
	this.yellow2 = this.physics.add.image(450, 50, 'yellow');
	this.yellow3 = this.physics.add.image(350, 100, 'yellow');
	this.yellow4 = this.physics.add.image(450, 100, 'yellow');
	this.green1 = this.physics.add.image(350, 50, 'green');
	this.green2 = this.physics.add.image(450, 50, 'green');
	this.green3 = this.physics.add.image(350, 100, 'green');
	this.green4 = this.physics.add.image(450, 100, 'green');
	
	this.opv1 = true;
	this.opv2 = false;
	this.lanchahabilitada = false;
	this.helicopterohabilitado = false;
	
	this.pesquero1Habilitado = true;
	this.pesquero2Habilitado = false;
	this.pesquero3Habilitado = false;
	this.pesquero4Habilitado = false;

	//Avisos restantes a pesqueros
	var cantAvisosP1 = 300;
	var cantAvisosP2 = 300;
	var cantAvisosP3 = 300;
	var cantAvisosP4 = 300;
	
	
	var energiaPesquero1 = 10;
	var energiaPesquero2 = 10;
	var energiaPesquero3 = 10;
	var energiaPesquero4 = 10;
	
	var cantPeces = 100;
	
	//explosion
	var explotar = {
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23, first: 23 }),
        frameRate: 20
    };
	this.anims.create(explotar);
	
	
	
	this.text1 = this.add.text(10, 10, '', { font: '16px Courier', fill: '#ffffff' });
	this.text2 = this.add.text(10, 300, '', { font: '16px Courier', fill: '#ffffff' });
	this.text3 = this.add.text(10, 400, '', { font: '16px Courier', fill: '#ffffff' });
	
	this.textCantPeces = this.add.text(600, 60, 'Peces: ' + cantPeces , {  fontSize: '20px', fill: '#000' });
	this.scoreText = this.add.text(600, 32, 'Puntuación: 0', { fontSize: '20px', fill: '#000' });
	this.textEnergia1 = this.add.text(600, 120, 'Energia: ' + this.energiaPesquero1 , {  fontSize: '20px', fill: '#000' });
	
	//radarbarco1
	this.graphics = this.add.graphics();
    this.radarBarco = new Phaser.Geom.Circle(this.barco.x, this.barco.y, 100);
		
	//radarbarco2
	 this.radarBarco2 = new Phaser.Geom.Circle(this.barco2.x, this.barco2.y, 50);
	 
	 //radarHelicoptero
	 this.radarHelicoptero = new Phaser.Geom.Circle(this.barco.x, this.barco.y, 200);
	 
	 //radarLancha
	 this.radarLancha = new Phaser.Geom.Circle(this.barco.x, this.barco.y, 30);
	
	
	//  Creates 30 bullets, using the 'bullet' graphic
    this.weapon = this.add.weapon(30, 'bullet');
	
	//  Creates 30 bullets, using the 'bullet' graphic
    this.metralleta1 = this.add.weapon(30, 'balametralleta');
	this.metralleta2 = this.add.weapon(30, 'balametralleta');
	
    //  The bullet will be automatically killed when it leaves the world bounds
    // weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		
		
    //  The speed at which the bullet is fired
	this.weapon.bulletSpeed = 100;
	this.metralleta1.bulletSpeed = 500;
	this.metralleta2.bulletSpeed = 500;
    
	//  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    this.weapon.fireRate = 1000;
	this.metralleta1.fireRate = 100;
	this.metralleta2.fireRate = 100;
	
	this.weaponBullets = this.weapon.bullets;
	this.metralleta1Bullets = this.metralleta1.bullets;
	this.metralleta2Bullets = this.metralleta2.bullets;
	
    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    this.weapon.trackSprite(this.barco, 0, 0, true);
	this.metralleta1.trackSprite(this.barco, 0, 0, true);
	this.metralleta2.trackSprite(this.barco2, 0, 0, true);

	
  //  fireButton = this.input.keyboard.addKey('m');
	
	this.barco.setCollideWorldBounds(true);
	this.barco2.setCollideWorldBounds(true);
	this.lancha.setCollideWorldBounds(true); 
	this.helicoptero.setCollideWorldBounds(true);
	this.pesquero1.setCollideWorldBounds(true);  
	this.pesquero2.setCollideWorldBounds(true);  
	this.pesquero3.setCollideWorldBounds(true);  
	this.pesquero4.setCollideWorldBounds(true);
	
	this.physics.add.collider(this.barco, costa);
	this.physics.add.collider(this.barco2, costa);
	this.physics.add.collider(this.lancha, costa);
	this.physics.add.collider(this.pesquero1, costa);
	this.physics.add.collider(this.pesquero2, costa);
	this.physics.add.collider(this.pesquero3, costa);
	this.physics.add.collider(this.pesquero4, costa);
//	this.physics.add.collider(barco, lancha);
//	this.physics.add.collider(barco2, lancha);
//	this.physics.add.collider(barco, pesquero1);
//	this.physics.add.collider(barco2, pesquero1);
//	this.physics.add.collider(lancha, pesquero1);
//	this.physics.add.collider(barco, pesquero2);
//	this.physics.add.collider(barco2, pesquero2);
//	this.physics.add.collider(lancha, pesquero2);
//	this.physics.add.collider(barco, pesquero3);
//	this.physics.add.collider(barco2, pesquero3);
//	this.physics.add.collider(lancha, pesquero3);
//	this.physics.add.collider(barco, pesquero4);
//	this.physics.add.collider(barco2, pesquero4);
//	this.physics.add.collider(lancha, pesquero4);
//	this.physics.add.collider(pesquero1, pesquero2);
//	this.physics.add.collider(pesquero1, pesquero3);
//	this.physics.add.collider(pesquero1, pesquero4);
//	this.physics.add.collider(pesquero2, pesquero3);
//	this.physics.add.collider(pesquero2, pesquero4);
//	this.physics.add.collider(pesquero3, pesquero4);
//	this.physics.add.collider(barco, barco2);
//	this.physics.add.collider(barco, weapon.bullets);
//	this.physics.add.collider(barco2, weapon.bullets);
	
    this.barco.setDamping(true);
    this.barco.setDrag(0.99);
    this.barco.setMaxVelocity(20);
    this.barco2.setDamping(true);
    this.barco2.setDrag(0.99);
    this.barco2.setMaxVelocity(40);
	this.lancha.setDamping(true);
    this.lancha.setDrag(0.99);
    this.lancha.setMaxVelocity(60);
	this.helicoptero.setDamping(true);
    this.helicoptero.setDrag(0.99);
    this.helicoptero.setMaxVelocity(80);
	this.pesquero1.setDamping(true);
    this.pesquero1.setDrag(0.99);
    this.pesquero1.setMaxVelocity(40);
	this.pesquero2.setDamping(true);
    this.pesquero2.setDrag(0.99);
    this.pesquero2.setMaxVelocity(20);
	this.pesquero3.setDamping(true);
    this.pesquero3.setDrag(0.99);
    this.pesquero3.setMaxVelocity(40);
	this.pesquero4.setDamping(true);
    this.pesquero4.setDrag(0.99);
    this.pesquero4.setMaxVelocity(20);

	//cambio de asignacion de teclas para que no se tranque
	
	this.cursors = this.input.keyboard.createCursorKeys();
	this.teclaPesquero1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
	this.teclaPesquero2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
	this.teclaPesquero3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
	this.teclaPesquero4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
	this.teclaPausa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);	
	
	
	 function impactobala1 (bullet, pesquero1)
    {
		this.boom = this.add.sprite(pesquero1.x, pesquero1.y, 'explosion');
		this.boom.anims.play('explode');
		this.pesquero1.disableBody(true, true);
		this.green1.disableBody(true, true);
		this.yellow1.disableBody(true, true);
		this.red1.disableBody(true, true);
		bullet.kill();
		this.score += 10;
		this.scoreText.setText('Puntuación: ' + this.score);
	}
	this.physics.add.overlap(this.weaponBullets, this.pesquero1, impactobala1, null, this);
	
		
	function impactobala2 (bullet, pesquero2)
	{
			
		this.boom = this.add.sprite(pesquero2.x, pesquero2.y, 'explosion');
		this.boom.anims.play('explode');
		this.pesquero2.disableBody(true, true);
		this.green2.disableBody(true, true);
		this.yellow2.disableBody(true, true);
		this.red2.disableBody(true, true);
		bullet.kill();
		this.score += 10;
		this.scoreText.setText('Puntuación: ' + this.score);
				
	}
	this.physics.add.overlap(this.weaponBullets, this.pesquero2, impactobala2, null, this);
	
	function impactobala3 (bullet, pesquero3)
	{
			
		this.boom = this.add.sprite(pesquero3.x, pesquero3.y, 'explosion');
		this.boom.anims.play('explode');
		this.pesquero3.disableBody(true, true);
		this.green3.disableBody(true, true);
		this.yellow3.disableBody(true, true);
		this.red3.disableBody(true, true);
		bullet.kill();
		this.score += 10;
		this.scoreText.setText('Puntuación: ' + this.score);
				
	}
	this.physics.add.overlap(this.weaponBullets, this.pesquero3, impactobala3, null, this);

	function impactobala4 (bullet, pesquero4)
	{
			
		this.boom = this.add.sprite(pesquero4.x, pesquero4.y, 'explosion');
		this.boom.anims.play('explode');
		this.pesquero4.disableBody(true, true);
		this.green4.disableBody(true, true);
		this.yellow4.disableBody(true, true);
		this.red4.disableBody(true, true);
		bullet.kill();
		this.score += 10;
		this.scoreText.setText('Puntuación: ' + this.score);
				
	}
	this.physics.add.overlap(this.weaponBullets, this.pesquero4, impactobala4, null, this);
	
	function impactometralletapesquero1 (balametralleta, pesquero1)
	{	
		energiaPesquero1--;
		balametralleta.kill();
		if (energiaPesquero1 <= 0)
		{
			this.boom = this.add.sprite(this.pesquero1.x, this.pesquero1.y, 'explosion');
			this.boom.anims.play('explode');
			this.pesquero1.disableBody(true, true);
			this.green1.disableBody(true, true);
			this.yellow1.disableBody(true, true);
			this.red1.disableBody(true, true);
			this.score += 10;
			this.scoreText.setText('Puntuación: ' + this.score);
		}
	}
	this.physics.add.overlap(this.metralleta1Bullets, this.pesquero1, impactometralletapesquero1, null, this);
	this.physics.add.overlap(this.metralleta2Bullets, this.pesquero1, impactometralletapesquero1, null, this);
	this.textEnergia1.setText('Energia: ' + this.energiaPesquero1);

	function impactometralletapesquero2 (balametralleta, pesquero2)
	{	
		energiaPesquero2--;
		balametralleta.kill();
		if (energiaPesquero2 <= 0)
		{
			this.boom = this.add.sprite(pesquero2.x, pesquero2.y, 'explosion');
			this.boom.anims.play('explode');
			this.pesquero2.disableBody(true, true);
			this.green2.disableBody(true, true);
			this.yellow2.disableBody(true, true);
			this.red2.disableBody(true, true);
			this.score += 10;
			this.scoreText.setText('Puntuación: ' + this.score);
		}
	}
	this.physics.add.overlap(this.metralleta1Bullets, this.pesquero2, impactometralletapesquero2, null, this);
	this.physics.add.overlap(this.metralleta2Bullets, this.pesquero2, impactometralletapesquero2, null, this);
	
	function impactometralletapesquero3 (balametralleta, pesquero3)
	{	
		energiaPesquero3--;
		balametralleta.kill();
		if (energiaPesquero3 <= 0)
		{
			this.boom = this.add.sprite(pesquero3.x, pesquero3.y, 'explosion');
			this.boom.anims.play('explode');
			this.pesquero3.disableBody(true, true);
			this.green3.disableBody(true, true);
			this.yellow3.disableBody(true, true);
			this.red3.disableBody(true, true);
			this.score += 10;
			this.scoreText.setText('Puntuación: ' + this.score);
		}
	}
	this.physics.add.overlap(this.metralleta1Bullets, this.pesquero3, impactometralletapesquero3, null, this);
	this.physics.add.overlap(this.metralleta2Bullets, this.pesquero3, impactometralletapesquero3, null, this);

	function impactometralletapesquero4 (balametralleta, pesquero4)
	{	
		energiaPesquero4--;
		balametralleta.kill();
		if (energiaPesquero4 <= 0)
		{
			this.boom = this.add.sprite(pesquero4.x, pesquero4.y, 'explosion');
			this.boom.anims.play('explode');
			this.pesquero4.disableBody(true, true);
			this.green4.disableBody(true, true);
			this.yellow4.disableBody(true, true);
			this.red4.disableBody(true, true);
			this.score += 10;
			this.scoreText.setText('Puntuación: ' + this.score);
		}
	}
	this.physics.add.overlap(this.metralleta1Bullets, this.pesquero4, impactometralletapesquero4, null, this);
	this.physics.add.overlap(this.metralleta2Bullets, this.pesquero4, impactometralletapesquero4, null, this);

	
	
	function destruirBalaMetralleta1 (balametralleta, barco)
	{
		var distance = (Math.sqrt(Math.pow((balametralleta.x - barco.x),2) + Math.pow((balametralleta.y - barco.y),2)));
		console.log("distancia: " + (Math.sqrt(Math.pow((balametralleta.x - barco.x),2) + Math.pow((balametralleta.y - barco.y),2))));
		//if (Math.sqrt(Math.pow((balametralleta.x - barco.x),2) + Math.pow((balametralleta.y - barco.y),2))>100)
		if (distance>=100)	
		{
			console.log("entre");
		
			balametralleta.kill();
		}
	}
	this.physics.add.overlap(this.metralleta1Bullets, this.barco, destruirBalaMetralleta1, null, this);
	
	console.log ("llego..");
	
	
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

}




  update() 
  {
		this.graphics.clear();// para que no genere el strokeCircle
		this.textEnergia1.setText('Energia: ' + this.energiaPesquero1);
	
	
	if (this.teclaPesquero1.isDown && this.pesquero1.body.enable)
	{	
		this.pesquero1Habilitado = true;
		this.pesquero2Habilitado = false;
		this.pesquero3Habilitado = false;
		this.pesquero4Habilitado = false;
	}
	
	if (this.teclaPesquero2.isDown && this.pesquero2.body.enable)
	{
		this.pesquero1Habilitado = false;
		this.pesquero2Habilitado = true;
		this.pesquero3Habilitado = false;
		this.pesquero4Habilitado = false;
	}
	
	if (this.teclaPesquero3.isDown && this.pesquero3.body.enable)
	{
		this.pesquero1Habilitado = false;
		this.pesquero2Habilitado = false;
		this.pesquero3Habilitado = true;
		this.pesquero4Habilitado = false;
	}
	
	if (this.teclaPesquero4.isDown && this.pesquero4.body.enable)
	{
		this.pesquero1Habilitado = false;
		this.pesquero2Habilitado = false;
		this.pesquero3Habilitado = false;
		this.pesquero4Habilitado = true;
	}


	

	
	
	// movimientos
	
	if (this.pesquero1Habilitado)
	{			
		if (this.cursors.up.isDown)
		{
			this.physics.velocityFromRotation(this.pesquero1.rotation, 20, this.pesquero1.body.acceleration);
			this.pesquero1JsonMov();
		}
		else
		{
			this.pesquero1.setVelocity(0);
			this.pesquero1.setAcceleration(0);
		}

		if (this.cursors.left.isDown)
		{
			this.pesquero1.setAngularVelocity(-20);
			this.pesquero1JsonMov();
			
		}
		else if (this.cursors.right.isDown)
		{
			this.pesquero1.setAngularVelocity(20);
			this.pesquero1JsonMov();
		}
		else
		{
			this.pesquero1.setAngularVelocity(0);
		}
	}
	
	if (this.pesquero2Habilitado)
	{
		if (this.cursors.up.isDown)
		{
			this.physics.velocityFromRotation(this.pesquero2.rotation, 20, this.pesquero2.body.acceleration);
			this.pesquero2JsonMov();
		}
		else
		{
			this.pesquero2.setVelocity(0);
			this.pesquero2.setAcceleration(0);
		}

		if (this.cursors.left.isDown)
		{
			this.pesquero2.setAngularVelocity(-20);
			this.pesquero2JsonMov();
			
		}
		else if (this.cursors.right.isDown)
		{
			this.pesquero2.setAngularVelocity(20);
			this.pesquero2JsonMov();
		}
		else
		{
			this.pesquero2.setAngularVelocity(0);
		}
	}
	
	if (this.pesquero3Habilitado)
	{
		if (this.cursors.up.isDown)
		{
			this.physics.velocityFromRotation(this.pesquero3.rotation, 20, this.pesquero3.body.acceleration);
			this.pesquero3JsonMov();
		}
		else
		{
			this.pesquero3.setVelocity(0);
			this.pesquero3.setAcceleration(0);
		}

		if (this.cursors.left.isDown)
		{
			this.pesquero3.setAngularVelocity(-20);
			this.pesquero3JsonMov();
			
		}
		else if (this.cursors.right.isDown)
		{
			this.pesquero3.setAngularVelocity(20);
			this.pesquero3JsonMov();
		}
		else
		{
			this.pesquero3.setAngularVelocity(0);
		}
	}
	
	if (this.pesquero4Habilitado)
	{			
		if (this.cursors.up.isDown)
		{
			this.physics.velocityFromRotation(this.pesquero4.rotation, 20, this.pesquero4.body.acceleration);
			this.pesquero4JsonMov();
		}
		else
		{
			this.pesquero4.setVelocity(0);
			this.pesquero4.setAcceleration(0);
		}

		if (this.cursors.left.isDown)
		{
			this.pesquero4.setAngularVelocity(-20);
			this.pesquero4JsonMov();
			
		}
		else if (this.cursors.right.isDown)
		{
			this.pesquero4.setAngularVelocity(20);
			this.pesquero4JsonMov();
		}
		else
		{
			this.pesquero4.setAngularVelocity(0);
		}
	}
	
	if (!this.pesquero1Habilitado)
	{
		this.pesquero1.setAcceleration(0);
		this.pesquero1.setAngularVelocity(0);	
	}
	
	if (!this.pesquero2Habilitado)
	{
		this.pesquero2.setAcceleration(0);
		this.pesquero2.setAngularVelocity(0);	
	}
	
	if (!this.pesquero3Habilitado)
	{
		this.pesquero3.setAcceleration(0);
		this.pesquero3.setAngularVelocity(0);	
	}
	
	if (!this.pesquero4Habilitado)
	{
		this.pesquero4.setAcceleration(0);
		this.pesquero4.setAngularVelocity(0);	
	}
	

	// movimientos
	this.green1.setPosition (this.pesquero1.x, this.pesquero1.y);
	this.yellow1.setPosition (this.pesquero1.x, this.pesquero1.y);
	this.red1.setPosition (this.pesquero1.x, this.pesquero1.y);
	this.green2.setPosition (this.pesquero2.x, this.pesquero2.y);
	this.yellow2.setPosition (this.pesquero2.x, this.pesquero2.y);
	this.red2.setPosition (this.pesquero2.x, this.pesquero2.y);
	this.green3.setPosition (this.pesquero3.x, this.pesquero3.y);
	this.yellow3.setPosition (this.pesquero3.x, this.pesquero3.y);
	this.red3.setPosition (this.pesquero3.x, this.pesquero3.y);
	this.green4.setPosition (this.pesquero4.x, this.pesquero4.y);
	this.yellow4.setPosition (this.pesquero4.x, this.pesquero4.y);
	this.red4.setPosition (this.pesquero4.x, this.pesquero4.y);
	
	
	//avisos a pesqueros
	if(( (Math.sqrt(Math.pow((this.pesquero1.x - this.barco.x),2) + Math.pow((this.pesquero1.y - this.barco.y),2))<=100)& this.opv1 || 
			(Math.sqrt(Math.pow((this.pesquero1.x - this.barco2.x),2) + Math.pow((this.pesquero1.y - this.barco2.y),2))<=50)& this.opv2 || 
			(Math.sqrt(Math.pow((this.pesquero1.x - this.lancha.x),2) + Math.pow((this.pesquero1.y - this.lancha.y),2))<=30)& this.lanchahabilitada || 
			(Math.sqrt(Math.pow((this.pesquero1.x - this.helicoptero.x),2) + Math.pow((this.pesquero1.y - this.helicoptero.y),2))<=200)& this.helicopterohabilitado)  
			&& this.pesquero1.y>300 
			&& this.cantAvisosP1>0)	
		this.cantAvisosP1--;
		
	
		if(( (Math.sqrt(Math.pow((this.pesquero2.x - this.barco.x),2) + Math.pow((this.pesquero2.y - this.barco.y),2))<=100)& this.opv1 || 
			(Math.sqrt(Math.pow((this.pesquero2.x - this.barco2.x),2) + Math.pow((this.pesquero2.y - this.barco2.y),2))<=50)& this.opv2 || 
			(Math.sqrt(Math.pow((this.pesquero2.x - this.lancha.x),2) + Math.pow((this.pesquero2.y - this.lancha.y),2))<=30)& this.lanchahabilitada || 
			(Math.sqrt(Math.pow((this.pesquero2.x - this.helicoptero.x),2) + Math.pow((this.pesquero2.y - this.helicoptero.y),2))<=200)& this.helicopterohabilitado)  
			&& this.pesquero2.y>300 
			&& this.cantAvisosP2>0)	
		this.cantAvisosP2--;

		if(( (Math.sqrt(Math.pow((this.pesquero3.x - this.barco.x),2) + Math.pow((this.pesquero3.y - this.barco.y),2))<=100)& this.opv1 || 
			(Math.sqrt(Math.pow((this.pesquero3.x - this.barco2.x),2) + Math.pow((this.pesquero3.y - this.barco2.y),2))<=50)& this.opv2 || 
			(Math.sqrt(Math.pow((this.pesquero3.x - this.lancha.x),2) + Math.pow((this.pesquero3.y - this.lancha.y),2))<=30)& this.lanchahabilitada || 
			(Math.sqrt(Math.pow((this.pesquero3.x - this.helicoptero.x),2) + Math.pow((this.pesquero3.y - this.helicoptero.y),2))<=200)& this.helicopterohabilitado)  
			&& this.pesquero3.y>300 
			&& this.cantAvisosP3>0)	
		this.cantAvisosP3--;

		if(( (Math.sqrt(Math.pow((this.pesquero4.x - this.barco.x),2) + Math.pow((this.pesquero4.y - this.barco.y),2))<=100)& this.opv1 || 
			(Math.sqrt(Math.pow((this.pesquero4.x - this.barco2.x),2) + Math.pow((this.pesquero4.y - this.barco2.y),2))<=50)& this.opv2 || 
			(Math.sqrt(Math.pow((this.pesquero4.x - this.lancha.x),2) + Math.pow((this.pesquero4.y - this.lancha.y),2))<=30)& this.lanchahabilitada || 
			(Math.sqrt(Math.pow((this.pesquero4.x - this.helicoptero.x),2) + Math.pow((this.pesquero4.y - this.helicoptero.y),2))<=200)& this.helicopterohabilitado)  
			&& this.pesquero4.y>300 
			&& this.cantAvisosP4>0)	
		this.cantAvisosP1--;
	
	
	if (this.pesquero1.y>300)
		this.cantPeces--;
	if (this.pesquero3.y>300)
		this.cantPeces--;
	if (this.pesquero2.y>300 && this.pesquero2.body.acceleration.x == 0 && this.pesquero2.body.acceleration.y == 0)
		this.cantPeces--;
	if (this.pesquero4.y>300 && this.pesquero4.body.acceleration.x == 0 && this.pesquero4.body.acceleration.y == 0)
		this.cantPeces--;
		
	// cambios de color pesqueros
	
	if (this.cantAvisosP1>1 && this.cantAvisosP1<299)	
		this.green1.disableBody (true, true);
	if (this.cantAvisosP1<=1)
		this.yellow1.disableBody (true, true);
	if (this.cantAvisosP2>1 && this.cantAvisosP2<299)	
		this.green2.disableBody (true, true);
	if (this.cantAvisosP2<=1)
		this.yellow2.disableBody (true, true);
	if (this.cantAvisosP3>1 && this.cantAvisosP3<299)	
		this.green3.disableBody (true, true);
	if (this.cantAvisosP3<=1)
		this.yellow3.disableBody (true, true);
	if (this.cantAvisosP4>1 && this.cantAvisosP4<299)	
		this.green4.disableBody (true, true);
	if (this.cantAvisosP4<=1)
		this.yellow4.disableBody (true, true);
}
	
pesquero1JsonMov(){
	var JsonObj = {
			tipo: "movimiento",
			jugador: "pesquero1",
			pesquero1x: this.pesquero1.x,
			pesquero1y: this.pesquero1.y,
			pesquero1ang: this.pesquero1.angle,
			pesquero1rot: this.pesquero1.rotation
		};
	//////console.log(JSON.stringify(json));
    this.wsocket.send(JSON.stringify(JsonObj));
}

pesquero2JsonMov(){
	var JsonObj = {
			tipo: "movimiento",
			jugador: "pesquero2",
			pesquero2x: this.pesquero2.x,
			pesquero2y: this.pesquero2.y,
			pesquero2ang: this.pesquero2.angle,
			pesquero2rot: this.pesquero2.rotation
		};
	//////console.log(JSON.stringify(json));
    this.wsocket.send(JSON.stringify(JsonObj));
}

pesquero3JsonMov(){
	var JsonObj = {
			tipo: "movimiento",
			jugador: "pesquero3",
			pesquero3x: this.pesquero3.x,
			pesquero3y: this.pesquero3.y,
			pesquero3ang: this.pesquero3.angle,
			pesquero3rot: this.pesquero3.rotation
		};
	//////console.log(JSON.stringify(json));
    this.wsocket.send(JSON.stringify(JsonObj));
}

pesquero4JsonMov(){
	var JsonObj = {
			tipo: "movimiento",
			jugador: "pesquero4",
			pesquero1x: this.pesquero4.x,
			pesquero1y: this.pesquero4.y,
			pesquero1ang: this.pesquero4.angle,
			pesquero1rot: this.pesquero4.rotation
		};
	//////console.log(JSON.stringify(json));
    this.wsocket.send(JSON.stringify(JsonObj));
}

onMessage(evt) {
	var mensaje;
	console.log(evt.data);
	mensaje = JSON.parse(evt.data);
	console.log("Mensaje recibido: " + evt.data);
	
	if (mensaje["tipo"] == "movimiento")
	{
		if (mensaje["jugador"] == "opv1")
		{
			this.opv1 = true;
			this.opv2 = false;
			this.lanchahabilitada = false;
			this.helicopterohabilitado = false;
			this.barco.x = mensaje["barcox"];
			this.barco.y = mensaje["barcoy"];
			this.barco.angle = mensaje["barcoang"];
			this.barco.rotation = mensaje["barcorot"];
		}
		
		if (mensaje["jugador"] == "opv2")
		{	
			this.opv1 = false;
			this.opv2 = true;
			lanchahabilitada = false;
			this.helicopterohabilitado = false;
			this.barco2.x = mensaje["barco2x"];
			this.barco2.y = mensaje["barco2y"];
			this.barco2.angle = mensaje["barco2ang"];
			this.barco2.rotation = mensaje["barco2rot"];
		}
		
		if (mensaje["jugador"] == "lancha")
		{	
			this.opv1 = false;
			this.opv2 = false;
			this.lanchahabilitada = true;
			this.helicopterohabilitado = false;
			this.lancha.x = mensaje["lanchax"];
			this.lancha.y = mensaje["lanchay"];
			this.lancha.angle = mensaje["lanchaang"];
			this.lancha.rotation = mensaje["lancharot"];
		}
		
		if (mensaje["jugador"] == "helicoptero")
		{	
			this.opv1 = false;
			this.opv2 = false;
			this.lanchahabilitada = false;
			this.helicopterohabilitado = true;
			this.helicoptero.x = mensaje["helicopterox"];
			this.helicoptero.y = mensaje["helicopteroy"];
			this.helicoptero.angle = mensaje["helicopteroang"];
			this.helicoptero.rotation = mensaje["helicopterorot"];
		}
	}
	
	if (mensaje["tipo"] == "disparo")
	{
		if (mensaje["subtipo"] == "misil")
			weapon.fire() = mensaje ["disparoMisil"];
		if (mensaje["subtipo"] == "metralleta")
		{
			if (mensaje["jugador"] == "opv1")
				metralleta1.fire() = mensaje ["disparoMetralleta1"];
			if (mensaje["jugador"] == "opv2")
				metralleta2.fire() = mensaje ["disparoMetralleta2"];
		}
	console.log ("disparo");
	}

}	// onMessage
wsocket.onmessage = function (evt) { onMessage(evt) };



}

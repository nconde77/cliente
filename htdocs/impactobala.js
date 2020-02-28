class impactoBala extends Phaser.Game
{

create (config)
{
function impactobala1 (bullet, pesquero1)
	{
		boom = this.add.sprite(pesquero1.x, pesquero1.y, 'explosion');
		boom.anims.play('explode');
		pesquero1.disableBody(true, true);
		green1.disableBody(true, true);
		yellow1.disableBody(true, true);
		red1.disableBody(true, true);
		bullet.kill();
		score += 10;
		scoreText.setText('Puntuación: ' + score);
	}
	this.physics.add.overlap(weaponBullets, pesquero1, impactobala1, null, this);
	
	
}
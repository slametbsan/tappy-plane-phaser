// atur layout size sesuai dengan orientasi game yg dibuat
// horizontal: 1024 x 768
// portrait: 768 x 1024
var layoutSize = { 'w': 800, 'h': 480 };
var X_POSITION;
var Y_POSITION;

class scnMenu extends Phaser.Scene {
   constructor() {
      super({
         key: "scnMenu",
         pack: {
            files: [
               { type: 'image', key: 'logo', url: 'assets/gamedev_smkn1ngk.png' }
            ]
         }
      });
   }

   preload() {
      // load semua asset terlebih dahulu
      this.load.image('logo', 'assets/gamedev_smkn1ngk.png');
      this.load.image('planeGreen1', 'assets/planeGreen1.png');
      this.load.image('planeGreen2', 'assets/planeGreen2.png');
      this.load.image('planeGreen3', 'assets/planeGreen3.png');
      this.load.image('background', 'assets/background.png');
      this.load.image('button', 'assets/button.png');
      this.load.image('tap1', 'assets/tap1.png');
      this.load.image('tap2', 'assets/tap2.png');
      this.load.image('ground1', 'assets/ground1.png');
      this.load.image('rock1up', 'assets/rock1up.png');
      this.load.image('rock1down', 'assets/rock1down.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('gameover', 'assets/textGameOver.png');

      // sekedar tambahan untuk efek progress bar
      for (var i = 0; i < 2000; i++) {
         this.load.image('logo' + i, 'assets/gamedev_smkn1ngk.png');
      }

      var width = game.canvas.width;
      var height = game.canvas.height;

      var progressBar = this.add.graphics();

      var progressBox = this.add.graphics();
      progressBox.fillStyle(0x222222, 0.7);
      // progressBox.fillRect(x, y, w, h);
      progressBox.fillRect(width / 2 - 190, height / 2 + 40, 383, 20);

      var logoImage = this.add.image(width / 2, height / 2, 'logo');

      var percentText = this.add.text(width / 2, height / 2 + 50, '0%', {
         font: '10px monospace',
         fill: '#ffffff'
      });
      percentText.setOrigin(0.5, 0.5);

      this.load.on('progress', function (value) {
         percentText.setText(parseInt(value * 100) + '%');
         progressBar.clear();
         progressBar.fillStyle(0xffffff, 1);
         // progressBar.fillRect(250, 280, 300 * value, 30);
         progressBar.fillRect(width / 2 - 180, height / 2 + 45, 373 * value, 10);
      });

      // this.load.on('fileprogress', function (file) {
      //   assetText.setText('Loading asset: ' + file.key);
      // });

      this.load.on('complete', function () {
         progressBar.destroy();
         progressBox.destroy();
         percentText.destroy();
         logoImage.destroy();
      });
   }

   create() {
      X_POSITION = {
         'LEFT': 0,
         'CENTER': game.canvas.width / 2,
         'RIGHT': game.canvas.width
      };

      Y_POSITION = {
         'TOP': 0,
         'CENTER': game.canvas.height / 2,
         'BOTTOM': game.canvas.height
      };

      // background
      this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background');

      // membuat animasi pesawat dari beberapa image
      this.anims.create({
         key: 'plane1',
         frames: [
            { key: 'planeGreen1', frame: 0 },
            { key: 'planeGreen2', frame: 0 },
            { key: 'planeGreen3', frame: 0 },
         ],
         frameRate: 9,
         repeat: -1
      });

      // tampilkan
      this.add.sprite(X_POSITION.CENTER, Y_POSITION.CENTER, 'planeGreen1').play('plane1');

      // tambahkan button mulai
      var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 100, 'button');
      btnPlay.setInteractive();
      btnPlay.setScale(0);
      this.tweens.add({
         targets: btnPlay,
         ease: 'Back',
         duration: 500,
         delay: 50,
         scaleX: 0.5,
         scaleY: 0.5
      });

      // deteksi event pada buttonPlay
      btnPlay.on('pointerdown', function (pointer) { this.setTint(0xAF8260) });
      btnPlay.on('pointerout', function (pointer) { this.clearTint(); });
      btnPlay.on('pointerup', function (pointer) {
         this.clearTint();
         this.scene.scene.start('scnPlay');
      });
   }
};

class scnPlay extends Phaser.Scene {
   constructor() {
      super({ key: "scnPlay" });
   }

   create() {
      // background
      this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background');

      // membuat animasi tap-tap
      this.anims.create({
         key: 'tap',
         frames: [
            { key: 'tap1', frame: 0 },
            { key: 'tap2', frame: 0 },
         ],
         frameRate: 2,
         repeat: -1
      });

      // tampilkan tap-tap
      this.tapImage = this.add.sprite(X_POSITION.LEFT + 225, Y_POSITION.CENTER + 20, 'tap1').play('tap');

      // membuat animasi pesawat dari beberapa image
      this.anims.create({
         key: 'plane1',
         frames: [
            { key: 'planeGreen1', frame: 0 },
            { key: 'planeGreen2', frame: 0 },
            { key: 'planeGreen3', frame: 0 },
         ],
         frameRate: 9,
         repeat: -1
      });

      // tampilkan karakter player
      this.player = this.add.sprite(X_POSITION.LEFT + 100, Y_POSITION.CENTER, 'planeGreen1').play('plane1');

      this.isGameRunning = false;

      this.input.on('pointerup', function (pointer, currentlyOver) {
         this.isGameRunning = true;
         this.playerTweens = this.tweens.add({
            targets: this.player,
            ease: 'Power1',
            duration: 750,
            y: this.player.y - 100
         });
      }, this);

      if (this.isGameRunning) {
         tapImage.setActive(false).setVisible(false);
         console.log('ha ha h a');
      }

      // menambahkan halangan
      this.timerHalangan = 0;
      this.halangan = [];

      // MEMBUAT GROUND
      // this.ixGnd = Phaser.Math.Between(1, 3);
      this.szGnd = { 'width': 808, 'height': 71 };  //size image ground
      this.grounds = [];  //array ground

      this.createGnd = function (xPos, yPos) {
         let gnd = this.add.image(xPos, yPos, 'ground1');
         gnd.setData('kecepatan', 1); //kecepatan di-sama-kan dg halangan
         gnd.setDepth(6);
         this.grounds.push(gnd);
      }

      this.addGnd = function () {
         if (this.grounds.length > 0) {
            let lastGnd = this.grounds[this.grounds.length - 1];
            this.createGnd(lastGnd.x + this.szGnd.width, Y_POSITION.BOTTOM - 35);
         } else {
            this.createGnd(X_POSITION.LEFT + this.szGnd.width / 2, Y_POSITION.BOTTOM - 35);
         }
      }

      this.addGnd();
      this.addGnd();
      this.addGnd();

      // FUNGSI GAME OVER
      var myScene = this;
      this.gameOver = function () {
         myScene.scene.start('scnGameOver');
      }

   }

   update() {
      if (this.isGameRunning) {
         this.tapImage.setActive(false).setVisible(false);

         // MENGGERAKKAN GROUND
         for (let i = 0; i < this.grounds.length; i++) {
            this.grounds[i].x -= this.grounds[i].getData('kecepatan');

            if (this.grounds[i].x < X_POSITION.LEFT - this.szGnd.width / 2) {
               this.addGnd();

               this.grounds[i].destroy();
               this.grounds.splice(i, 1);
               break;
            }

            // deteksi tubrukan dengan ground
            if (this.grounds[i].getBounds().contains(this.player.x, this.player.y)) {
               this.isGameRunning = false;
               // this.snd_dead.play();

               var myScene = this;

               this.charaTweens = this.tweens.add({
                  targets: this.player,
                  ease: 'Elastic.easeOut',
                  duration: 2000,
                  alpha: 0,
                  onComplete: myScene.gameOver
               });

               break;
            }
         }

         // PLAYER
         this.player.y += 1; // karakter player selalu turun
         if (this.player.y > Y_POSITION.BOTTOM - 45) this.player.y = Y_POSITION.BOTTOM - 45; //mencegah karakter player jatuh keluar arena
         if (this.player.y < Y_POSITION.TOP + 45) this.player.y = Y_POSITION.TOP + 45; //mencegah karakter player terbang keluar arena

         // HALANGAN
         if (this.timerHalangan == 0) {
            var posisi_x = Math.floor((Math.random() * 100) + 808); //acak posisi x halangan saat dibuat di kanan-luar arena
            var posisi_y = Y_POSITION.BOTTOM - Math.floor((Math.random() * 150) + 100); //tertinggi (Y_POSITION.BOTTOM - 235)
            var halanganBaru = this.add.image(posisi_x, posisi_y, 'rock1up');

            // mengubah anchor point berada di kiri, bukan di tengah
            halanganBaru.setOrigin(0.0);
            halanganBaru.setData('status_aktif', true);
            halanganBaru.setDepth(5);

            // masukkan halangan ke dalam array
            this.halangan.push(halanganBaru);

            // mengatur waktu untuk memunculkan halangan selanjutnya
            this.timerHalangan = Math.floor((Math.random() * 100) + 500);
         }

         for (let i = this.halangan.length - 1; i >= 0; i--) {
            // menggerakkan halangan dg kecepatan tetap
            this.halangan[i].x -= 1;

            // hapus halangan jika keluar layar
            if (this.halangan[i].x < -200) {
               this.halangan[i].destroy();
               this.halangan.splice(i, 1);
               break;
            }

            // deteksi tubrukan dg halangan
            if (this.halangan[i].getBounds().contains(this.player.x, this.player.y)) {
               this.halangan[i].setData('status_aktif', false);
               this.isGameRunning = false;
               // this.snd_dead.play();

               var myScene = this;

               this.charaTweens = this.tweens.add({
                  targets: this.player,
                  ease: 'Elastic.easeOut',
                  duration: 2000,
                  alpha: 0,
                  onComplete: myScene.gameOver
               });

               break;
            }

         }

         // mengurangi timer
         this.timerHalangan--;
      }
   }
};

class scnGameOver extends Phaser.Scene {
   constructor() {
      super({ key: "scnGameOver" });
   }

   create() {
      var txtGameOver = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'gameover');
      txtGameOver.setScale(0);

      this.tweens.add({
         targets: txtGameOver,
         ease: 'bounce.out',
         duration: 500,
         delay: 200,
         scaleX: 1,
         scaleY: 1
      });

      // tambahkan button mulai
      var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 100, 'button');
      btnPlay.setInteractive();
      btnPlay.setScale(0);
      this.tweens.add({
         targets: btnPlay,
         ease: 'Back',
         duration: 500,
         delay: 50,
         scaleX: 0.5,
         scaleY: 0.5
      });

      // deteksi event pada buttonPlay
      btnPlay.on('pointerdown', function (pointer) { this.setTint(0xAF8260) });
      btnPlay.on('pointerout', function (pointer) { this.clearTint(); });
      btnPlay.on('pointerup', function (pointer) {
         this.clearTint();
         this.scene.scene.start('scnPlay');
      });
   }

};

// konfigurasi phaser
const config = {
   type: Phaser.AUTO,
   scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: layoutSize.w,
      height: layoutSize.h
   },
   plugins: {
      scene: [
         { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" }
      ]
   },
   scene: [scnMenu, scnPlay, scnGameOver],
};

const game = new Phaser.Game(config);
// atur layout size sesuai dengan orientasi game yg dibuat
// horizontal: 1024 x 768
// portrait: 768 x 1024
var layoutSize = { 'w': 800, 'h': 480 };
var X_POSITION;
var Y_POSITION;
var snd_efek = null;
var snd_music = null;
var score;

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
      this.load.path = 'assets/';
      // load semua asset terlebih dahulu
      this.load.image('logo', 'gamedev_smkn1ngk.png');
      this.load.image('planeGreen1', 'planeGreen1.png');
      this.load.image('planeGreen2', 'planeGreen2.png');
      this.load.image('planeGreen3', 'planeGreen3.png');
      this.load.image('background', 'background.png');
      this.load.image('button', 'button.png');
      this.load.image('tap1', 'tap1.png');
      this.load.image('tap2', 'tap2.png');
      this.load.image('tap', 'tap.png');
      this.load.image('ground1', 'ground1.png');
      this.load.image('rock1up', 'rock1up.png');
      this.load.image('rock1down', 'rock1down.png');
      this.load.image('star', 'star.png');
      this.load.image('gameover', 'textGameOver.png');
      this.load.image('judulgame', 'judulgame.png');
      this.load.image('panelskor', 'panelskor.png');
      this.load.image('skorfinal', 'skorfinal.png');
      this.load.image('sound_on', 'sound_on.png');
      this.load.image('sound_off', 'sound_off.png');
      this.load.image('music_on', 'music_on.png');
      this.load.image('music_off', 'music_off.png');
      this.load.image('meledak', 'meledak.png');  //partikel ledakan

      this.load.audio([
         { key: 'terbang', url: ['terbang.ogg', 'terbang.mp3'] },
         { key: 'musik', url: ['musik.ogg', 'musik.mp3'] },
         { key: 'klik', url: ['klik.ogg', 'klik.mp3'] },
         { key: 'meledak', url: ['meledak.ogg', 'meledak.mp3'] },
      ]);

      // sekedar tambahan untuk efek progress bar
      for (var i = 0; i < 2000; i++) {
         this.load.image('logo' + i, 'gamedev_smkn1ngk.png');
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
      this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'judulgame');

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

      // cek variabel snd_efek
      if (snd_efek == null) {
         snd_efek = this.sound.add('klik');
      }

      // music
      snd_music = this.sound.add('musik');
      snd_music.loop = true;
      snd_music.setVolume(1);
      snd_music.play();

      // button music
      var btnMusic = this.add.image(X_POSITION.RIGHT - 100, Y_POSITION.TOP + 50, 'music_on');
      btnMusic.setScale(0.7);
      btnMusic.setInteractive();

      // deteksi event pada btnMusic
      btnMusic.on('pointerdown', function (pointer) { this.setTint(0x5a5a5a) });
      btnMusic.on('pointerout', function (pointer) { this.clearTint(); });
      btnMusic.on('pointerup', function (pointer) {
         this.clearTint();
         // ambil data dari database
         isMusicActive = localStorage['music_enabled'] || 1;

         if (isMusicActive == 0) {
            this.setTexture('music_on');
            // snd_music.setVolume(1);
            snd_music.play();
            // mengubah data yg tersimpan
            localStorage['music_enabled'] = 1;
         } else {
            this.setTexture('music_off');
            // snd_music.setVolume(0);
            snd_music.stop();
            // mengubah data yg tersimpan
            localStorage['music_enabled'] = 0;
         }

         this.setTint(0xffffff);
         snd_efek.play();
      });

      let isMusicActive = localStorage['music_enabled'] || 1;
      if (isMusicActive == 0) {
         btnMusic.setTexture('music_off');

         snd_music.stop();
      }

      // button Sound
      var btnSound = this.add.image(X_POSITION.RIGHT - 50, Y_POSITION.TOP + 50, 'sound_on');
      btnSound.setScale(0.7);
      btnSound.setInteractive();

      // deteksi event pada btnSound
      btnSound.on('pointerdown', function (pointer) { this.setTint(0x5a5a5a) });
      btnSound.on('pointerout', function (pointer) { this.clearTint(); });
      btnSound.on('pointerup', function (pointer) {
         this.clearTint();
         // ambil data dari database
         isSoundActive = localStorage['sound_enabled'] || 1;

         if (isSoundActive == 0) {
            this.setTexture('sound_on');
            snd_efek.setVolume(1);
            // mengubah data yg tersimpan
            localStorage['sound_enabled'] = 1;
         } else {
            this.setTexture('sound_off');
            snd_efek.setVolume(0);
            // mengubah data yg tersimpan
            localStorage['sound_enabled'] = 0;
         }

         this.setTint(0xffffff);
         snd_efek.play();
      });

      // ambil dari database dg key 'sound_enabled'
      let isSoundActive = localStorage['sound_enabled'] || 1;
      if (isSoundActive == 0) {
         btnSound.setTexture('sound_off');
         snd_efek.setVolume(0);
      }
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
      this.tapImage.setDepth(5);

      // tampilkan teks tap
      this.tapTxt = this.add.image(this.tapImage.x + 50, this.tapImage.y + 20, 'tap');

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

      // MENAMBAHKAN PANEL SKOR
      this.score = 0;
      this.panel_score = this.add.image(X_POSITION.CENTER, 50, 'panelskor');
      this.panel_score.setOrigin(0.5);
      this.panel_score.setDepth(10);
      this.panel_score.setAlpha(0.8);
      // membuat label nilai dengan nilai dari variabel this.score
      this.label_score = this.add.text(this.panel_score.x + 25, this.panel_score.y, this.score);
      this.label_score.setOrigin(0.5);
      this.label_score.setDepth(10);
      this.label_score.setFontSize(30);
      this.label_score.setTint(0x1A4D2E);

      // tambahkan obyek partikel
      let meledak = this.add.particles('meledak');

      // membuat emiter carrot
      this.emiterMeledak = meledak.createEmitter({
         speed: { min: 50, max: 250 },
         gravity: { x: 0, y: 200 },
         scale: { start: 0, end: 1 },
         lifespan: { min: 200, max: 300 },
         quantity: { min: 5, max: 15 },
      });

      this.emiterMeledak.setPosition(-1000, -1000);
      this.emiterMeledak.explode();

      // FUNGSI GAME OVER
      var myScene = this;
      this.gameOver = function () {
         snd_music.stop();
         myScene.scene.start('scnGameOver'); //kirim nilai score ke sceneGameOver
      }

      // SOUND FX
      this.snd_terbang = this.sound.add('terbang');
      this.snd_terbang.play();
      this.snd_terbang.setVolume(0);

      this.snd_meledak = this.sound.add('meledak');

      let soundState = localStorage['sound_enabled'] || 1;
      if (soundState == 0) {
         this.snd_terbang.setVolume(0);
         this.snd_meledak.setVolume(0);
      }

   }

   update() {
      if (this.isGameRunning) {
         this.tapImage.setActive(false).setVisible(false);
         this.tapTxt.setActive(false).setVisible(false);
         this.snd_terbang.setVolume(1);

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
               this.snd_terbang.setVolume(0);
               this.snd_meledak.play();

               // aktifkan partikel ketika player mati
               this.emiterMeledak.setPosition(this.player.x, this.player.y);
               this.emiterMeledak.explode();

               let skorTertinggi = localStorage['HighScore'] || 0;
               score = this.score;
               if (this.score > skorTertinggi) { localStorage['SkorTertinggi'] = this.score; }

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
            this.timerHalangan = Math.floor((Math.random() * 100) + 400);
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
               this.snd_terbang.setVolume(0);
               this.snd_meledak.play();

               let skorTertinggi = localStorage['HighScore'] || 0;
               score = this.score;
               if (this.score > skorTertinggi) { localStorage['SkorTertinggi'] = this.score; }

               var myScene = this;
               this.charaTweens = this.tweens.add({
                  targets: this.player,
                  ease: 'Elastic.easeOut',
                  duration: 2000,
                  alpha: 0,
                  onComplete: myScene.gameOver
               });

               // aktifkan partikel ketika player mati
               this.emiterMeledak.setPosition(this.player.x, this.player.y);
               this.emiterMeledak.explode();

               break;
            }

            // menambah score jika posisi halangan + 50 lebih kecil dari posisi karakter dan status halangan masih aktif
            if (this.player.x > this.halangan[i].x + 50 && this.halangan[i].getData('status_aktif') == true) {
               // ubah status halangan menjadi tidak aktif
               this.halangan[i].setData('status_aktif', false);
               // tambahkan skor
               this.score++;
               // ubah lanel menjadi nilai terbaru
               this.label_score.setText(this.score);
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

   create(data) {
      this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background');
      var txtGameOver = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 100, 'gameover');
      txtGameOver.setScale(0);

      this.tweens.add({
         targets: txtGameOver,
         ease: 'bounce.out',
         duration: 500,
         delay: 200,
         scaleX: 1,
         scaleY: 1
      });

      // panel skor akhir
      const panelSkor = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'skorfinal');
      panelSkor.setScale(0.8);

      // cek score
      let skorTertinggi = localStorage['SkorTertinggi'] || 0;

      // MEMBUAT TAMPILAN SKOR TERTINGGI
      this.labelHighscore = this.add.text(panelSkor.x + 50, panelSkor.y + 5, skorTertinggi, {
         fontFamily: 'Arial',
         fontSize: '30px',
         fontStyle: 'bold',
         color: '#1A4D2E',
      });
      this.labelHighscore.setOrigin(0.5);
      this.labelHighscore.setDepth(100);

      // MEMBUAT TAMPILAN SKOR
      this.labelScore = this.add.text(panelSkor.x - 100, panelSkor.y + 5, score, {
         fontFamily: 'Arial',
         fontSize: '30px',
         fontStyle: 'bold',
         color: '#1A4D2E',
      });
      this.labelScore.setOrigin(0.5);
      this.labelScore.setDepth(100);

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
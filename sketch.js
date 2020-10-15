// 2D array assignment/game
// Darren Koshinsky
// 13/10/2020
//
// Extra for Experts:
// I used 2d arrays in multiple places, Inventory and to name two of them.
// I think what pushed me above and beyond on this project was the use of
// splicing to swap the items in your inventory slot and the use of arrays
// and 2d arrays inside of maps for my weapon.

// Background managment.
let background1, background2, background3, background4, background5, background6, background7, background8;
let backgrounds = [];
let backgroundSelection = [];
let backgroundColour;

// Counters used to change between sprites, screens/gamestates, and locations
let state = "start";
let areaCounter = 1;

// Inventory
// ITMES
// Weapons

let sword1, sword2, sword3, sword4, sword5, sword6, sword7, sword8, sword9, sword10, sword11, sword12, sword13, sword14, sword15, sword16;

let weapons = new Map();
let weaponsKey = ["Stick", "Wooden Sword", "Iron Sword", "Gold Sword", "Fancy Gold Sword", "Cursed Gold Sword", "Crystal Sword", "Enchanted Crystal Sword", "Magma Sword", "Crystal Broad Sword", "Enchanted Crystal Broad Sword", "Feiry Crystal Broad Sword", "Boss Sword 1", "Boss Sword 2", "Boss Sword 3", "Boss Sword 4"];
weapons.set("Stick", [50, sword1]);
let weaponLevel = 0;

// Potions
class Potion {
  constructor(type) {
    this.potionType = type;
    this.healthPotionSprite = loadImage("assets/items/healthPotion.png");
    this.damagePotionSprite = loadImage("assets/items/damagePotion.png");
    this.isBeingDragged = false;
    this.spriteSize = 30 * sideBar.sideBarScaler;
    if (this.potionType === "health") {
      this.sprite = this.healthPotionSprite;
      this.hp = 50;
    }
    else if (this.potionType === "damage") {
      this.sprite = this.damagePotionSprite;
      this.hp = -50;
    }
  }

  display(location, size, cellNumber) {
    if (!this.isBeingDragged) {
      image(this.sprite, location[cellNumber][0] + size/2, location[cellNumber][1] + size/2, this.spriteSize, this.spriteSize);
    }
    else{
      image(this.sprite, mouseX, mouseY, this.spriteSize, this.spriteSize);
    }
  }
}

// inventory[0] is what is equipped inventory[1] and inventory[2] are your inventory
// inventory[0][0] is weapon, inventory[0][1] is armour, inventory[0][2] is ring 
let inventory = [[weaponsKey[0], "armour", "ring"], [" ", " ", " "], [" ", " ", " "]];
let sideBar; 
class PlayerMenu {
  constructor(sprites) {
    this.isItemBeingDragged = false;
    this.sideBarScaler = height/789;
    this.sideBarWidth = width/ (5+1/3);
    this.weaponCellY = 300 * this.sideBarScaler;
    this.inventoryCellSize = 50 * this.sideBarScaler;
    this.sprite = sprites[0];
    this.spriteY = height/6;
    this.tempInventory = [];
    this.inventoryCellLocation = [];
    this.hotbarCellLocation = [];
    this.dragStartLocation;
    this.draggedItem;
    this.cellX;
    this.cellY;

  }

  // Grey sidebar, sprite, text
  display() {
    push();
    // Grey Sidebar
    fill("grey");
    rect(width-this.sideBarWidth, 0, this.sideBarWidth, height);

    // Displaying all text. Area counter, Kill counter
    fill("black");
    textAlign(CENTER);
    textSize(25 * this.sideBarScaler);
    text("Area: " + areaCounter, width - this.sideBarWidth /2, 50 * this.sideBarScaler);
    text("Kills:" + character.enemyKills, width - this.sideBarWidth / 2, 230 * this.sideBarScaler);
  
    // Character display.
    rectMode(CENTER);
    fill(180);
    rect(width - this.sideBarWidth/2, this.spriteY, 135* this.sideBarScaler, 135* this.sideBarScaler, 10);
    image(this.sprite, width - this.sideBarWidth/2, this.spriteY, 100 * this.sideBarScaler, 100 * this.sideBarScaler);
    pop();

  }

  // Player Health Bar
  healthBar() {
    rectMode(CORNER);
    // This draws the outline and the grey behind your health when you loose some HP
    fill(180);
    rect(width - this.sideBarWidth + 50 * this.sideBarScaler, 265 * this.sideBarScaler, 200 * this.sideBarScaler, 20 * this.sideBarScaler);
   
    // Changes the colour of your health bar depending on how much health you have. It changes every 1/3 of your max health you loose/
    if(character.health > 66) {
      fill("green");
    }
    else if (character.health > 33) {
      fill("orange");
    }
    else {
      fill("red");
    }

    // If your health drops below 0 changes your state to dead and ends the game. I should move this however I have not yet done so, as it does not need to be in this function and does not make much sense to be here.
    if (character.health < 0 && state === "play") {
      state = "dead";
    }
    // Drawns the box that represents how much health you have left. It takes your current health divided by your max health to get the percentage of health left and 
    // multiplies it by the total space you have for your health bar
    // eslint-disable-next-line no-extra-parens
    rect(width - this.sideBarWidth + 50 * this.sideBarScaler, 265 * this.sideBarScaler, ((character.health / 100) * (200 * this.sideBarScaler) ), 20 * this.sideBarScaler);
  }

  // Inventory
  // This is currently using a bunch of magic numbers which are based around a screen size of 1578 x 789. I plan to change this when I have the time.
  displayInventory() {
    push();

    // Hotbar/equipped Items.
    // Makes the black border around the hotbar slots.
    fill("black");
    rect(width - 240 * this.sideBarScaler, 290 * this.sideBarScaler, 190* this.sideBarScaler, 70 * this.sideBarScaler, 15);
    // Hotbar Slots
    fill(80);
    for(let x = 1; x < inventory[0].length+1; x++) {
      // Location of the cell
      let equippedCellX = width - 290*this.sideBarScaler + (this.inventoryCellSize + this.inventoryCellSize/5) * x;
      let equippedCellY = 300 * this.sideBarScaler;
      // Drawing the cell
      rect(equippedCellX, equippedCellY, this.inventoryCellSize, this.inventoryCellSize, 15);
      if (this.hotbarCellLocation.length < 3) {
        this.hotbarCellLocation.push([equippedCellX, equippedCellY]);
        console.log(this.hotbarCellLocation);
      }
    }
    
    // Box surrounding the inventory slots.
    fill("black");
    rect(width - 240 * this.sideBarScaler, 375 * this.sideBarScaler, 190 * this.sideBarScaler, 130 * this.sideBarScaler, 15);

    // boxes for inventoy slots
    rectMode(CORNER);
    fill(80);
    // Iterates through the inventory except for the hotbar/equipped items.
    for(let y = 1; y < inventory.length; y++) {
      for(let x = 1; x < inventory[y].length+1; x++) {
        // Sets the cell location.
        let cellX = width - 290*this.sideBarScaler + (this.inventoryCellSize + this.inventoryCellSize/5) * x;
        let cellY = 325 *this.sideBarScaler + (this.inventoryCellSize + this.inventoryCellSize/5) * y;
        // Draws the Cell
        rect(cellX, cellY, this.inventoryCellSize, this.inventoryCellSize, 15);

        // Takes the first six slots, in this case all slots, and stores their location in an array.
        if (this.inventoryCellLocation.length < 6) {
          this.inventoryCellLocation.push([cellX, cellY]);
        }
      }

    }
    pop();
  }

  // Items
  displayItems(){
    // Equipment slots
    // Weapon 
    push();
    if (inventory[0][0] !== " ") {
      // location of the first slot 
      let equippedCellX = width - 290*this.sideBarScaler + (this.inventoryCellSize + this.inventoryCellSize/5);
      let equippedCellY = 300 * this.sideBarScaler;
      // Fills the slot with a color based on weapon equipped. This will eventually get replaced by a sprite but I did not have time to make one.
      imageMode(CENTER);
      image(weapons.get(inventory[0][0])[1], equippedCellX + this.inventoryCellSize/2, equippedCellY + this.inventoryCellSize/2, 30, 30);
    }
    pop();
    // Armour - haven't added any yet
    // Ring - haven't added any yet

    // Inventory Slots
    let cellCounter = 0;
    // iterates through your inventory slots and displays what item shoud be there
    for (let y = 1; y < inventory.length; y++) {
      for (let x = 0; x < inventory[y].length; x++) {
        // Checks if the inventory slot is empty
        if (inventory[y][x] !== " "){
          // displays item
          inventory[y][x].display(this.inventoryCellLocation, this.inventoryCellSize, cellCounter);
        }
        cellCounter++;
      }
    }
  }
  
  // displays info about an item when you hover over it
  displayInfo() {
    // Check Hotbar
    for(let j = 0; j < 3; j++) {
      if (mouseX > this.hotbarCellLocation[j][0] && mouseX < this.hotbarCellLocation[j][0] + this.inventoryCellSize &&
        mouseY > this.hotbarCellLocation[j][1] && mouseY < this.hotbarCellLocation[j][1] + this.inventoryCellSize) {
        fill(120);
        rect(mouseX-150, mouseY-150, 150);
        fill("black");
        textAlign(CENTER);
        textSize(20);
        push();
        rectMode(CENTER);
        if (j === 0) {
          text(weaponsKey[weaponLevel], mouseX-75, mouseY-80, 80, 100);
          text("Damage: " + weapons.get(weaponsKey[weaponLevel])[0],  mouseX-75, mouseY - 20);
        }
        else if (j === 1) {
          text("Armour", mouseX-75, mouseY-80);
        }
        else {
          text("Ring", mouseX-75, mouseY-80);
        }
        pop();
      }
    }

    // Check inventory slots
    for (let i = 0; i < 6; i++) {
      // Checks if the mouse is within that inventory slot and if it is calls the useItem function with that slots location.
      if (mouseX > this.inventoryCellLocation[i][0] && mouseX < this.inventoryCellLocation[i][0] + this.inventoryCellSize &&
        mouseY > this.inventoryCellLocation[i][1] && mouseY < this.inventoryCellLocation[i][1] + this.inventoryCellSize) {
        push();
        textAlign(CENTER);
        textSize(20);
        if (i < 3) {
          if (inventory[1][i%3] instanceof Potion) {
            fill(120);
            rect(mouseX-150, mouseY-150, 150);
            fill("black");
            text(inventory[1][i%3].potionType + " potion", mouseX-75, mouseY-80);
            if (inventory[1][i%3].potionType === "damage"){
              text(inventory[1][i%3].hp + " HP",  mouseX-75, mouseY - 50);
            }
            else {
              text("+" + inventory[1][i%3].hp + " HP",  mouseX-75, mouseY - 50);
            }          
          }
        }
        else {
          if (inventory[2][i%3] instanceof Potion) {
            fill(120);
            rect(mouseX-150, mouseY-150, 150);
            fill("black");
            text(inventory[2][i%3].potionType + " potion", mouseX-75, mouseY-80);

            if (inventory[2][i%3].potionType === "damage"){
              text(inventory[2][i%3].hp + " HP",  mouseX-75, mouseY - 50);
            }
            else {
              text("+" + inventory[2][i%3].hp + " HP",  mouseX-75, mouseY - 50);
            }
          }
        }
        pop();
      }
    }
  }

  // Use Items
  useItem(inventorySlot) {
    // inventory slot is a number from 0-5. 0 being the top left slot and 5 being the bottom right slot.
    let x = inventorySlot % 3;
    let y;
    if (inventorySlot > 2) {
      y = 2;
    }
    else {
      y = 1;
    }
    // Sanity check to make sure you do not overheal above your maximum health.
    if (inventory[y][x] instanceof Potion) {
      if (character.maxHealth - character.health < 50 && inventory[y][x].potionType === "health") {
        character.health = character.maxHealth;
      }
      // applies the potion affect which is +50hp for healing potions and - 50hp for damaging potions. 
      else{
        character.health += inventory[y][x].hp;
      }
      // Sets that inventory slot to be a blank string or empty after an item has been used
      inventory[y].splice(x, 1, " ");
    }
  }

  // sideBar.dragItems( 0, 1 , 1, 1)
  dragItems(startX, startY, endX, endY) {
    this.tempInventory = [];
    this.tempInventory.push(inventory[startY][startX]);
    this.tempInventory.push(inventory[endY][endX]);

    inventory[startY].splice(startX, 1, this.tempInventory[1]);
    inventory[endY].splice(endX, 1, this.tempInventory[0]); 
  }

}

// Player managment
let sprites = [];
let knightLeft1, knightRight1, knightLeft2, knightRight2, knightStill;
let character;
class Player {
  constructor(sprites, inventory) {
    this.health = 100;
    // this.health = Infinity; // God Mode for testing
    this.maxHealth = this.health;
    this.weapon = weapons.get(inventory[0][0]);
    this.playerDamage = 1 * this.weapon[0];
    this.enemyKills = 0;
    this.equippedWeapon = inventory[0];
    
    
    //sprite managment
    this.playerSprite = sprites;
    this.spriteSelector = 0;
    this.hitboxScale = 9;
    this.spriteScale = 9;
    
    // Movement
    this.isMovingRight = false;
    this.isMovingLeft = false;
    this.isGrounded = false;
    this.isJumping = false;
    this.movementSpeed = 10;
    this.jumpHeight = 100;
    this.jumpSpeed = 12;
    this.gravity = 5;
    this.initialY;
    this.x;
    this.y;


  }
  // Draws Sprite depending on which way you are moving or if you are standing still.
  displaySprite() {
    push();
    imageMode(CORNER);
    if (this.isMovingLeft) {
      if (frameCount % 30 >= 15 && this.spriteSelector !== 1) {
        this.spriteSelector = 1;
      }
      else if (frameCount % 30 < 15){
        this.spriteSelector = 2;
      }
    }
    else if (this.isMovingRight) {
      if (frameCount % 30 >= 15 && this.spriteSelector !== 3) {
        this.spriteSelector = 3;
      }
      else if (frameCount % 30 < 15){
        this.spriteSelector = 4;
      }
    }
    else {
      this.spriteSelector = 0;
    }
    image(this.playerSprite[this.spriteSelector], this.x, this.y, height/this.spriteScale, height/this.spriteScale);
    pop();
  }

  // Checks if sprite should be moving and then moves the sprite
  handleMovement() {
    if (this.isMovingLeft && this.x > - height/this.spriteScale) {
      this.x -= this.movementSpeed;
    }
    if (this.isMovingRight) {
      this.x += this.movementSpeed;
    }
    if (this.isJumping) {
      if (this.y >= this.initialY - this.jumpHeight) {
        this.y -= this.jumpSpeed;
      }
      else {
        this.isJumping = false;
      }
    }
  }

  // Applies gravity and checks if you are on the ground
  applyGravity() {
    this.playerDamage = 1 * this.weapon[0];
    // Ground Detection
    this.isGrounded = collideLineRect(0 - 50, height * 0.63, width + 30, height * 0.63, this.x, this.y, height/this.hitboxScale, height/this.hitboxScale);
    
    if (!this.isGrounded && !this.isJumping) {
      this.y += this.gravity;
    }
  }

  // Changes background and resets location when you run off of the screen
  nextScreen() {
    let direction;
    // right side of the screen
    if (this.x > width - sideBar.sideBarWidth + 20) { // 20 is a buffer so it isnt instant and player can run off screeen
      this.x = 0;
      selectBackgrounds();
      areaCounter++;
      direction = "left";
      spawnEnemies(direction);
    } 
    // left side of the screen
    else if (this.x < 0 - 25) {
      this.health --;

    }
  }

  attack() {
    ellipse(this.x + height/this.spriteScale / 2, this.y + height/this.spriteScale / 2, 2.5 * height/this.hitboxScale);
    for (let i = 0; i < enemies.length; i++) {

      if (collideRectCircle(enemies[i].x, enemies[i].y, enemies[i].spriteSize, enemies[i].spriteSize, // enemy location
        this.x + height/this.spriteScale / 2, this.y + height/this.spriteScale / 2, 2.5 * height/this.hitboxScale)) { // attack hitbox

        enemies[i].health -= this.playerDamage;
      }
    }
  }
}

// Enemy managment
let enemies = [];
class Enemy {
  constructor(area, enemyType, x, direction) {
    // Health and Damage
    this.area = area;
    this.health = 100 * this.area;
    this.maxHealth = this.health;
    this.enemyDamage = 10 + areaCounter * 2;

    // Size
    this.scale = 15; // bigger number is a smaller enemy
    this.spriteSize = height/this.scale;
    
    // location
    this.y = height*0.63 - this.spriteSize; //Places the enemy on the ground
    this.x = x;

    // Enemy Movement
    this.direction = direction;
    this.speed = 2 * (this.area-2);

    this.colour = "blue";
  }
  // Displays enemy
  display() {

    // blue rectangles as enemy placeholders
    fill(this.colour);
    rect(this.x, this.y, this.spriteSize, this.spriteSize);

    // healthbar
    // outline
    // fill(180);
    noFill();
    rect(this.x, this.y - 15, this.spriteSize, 10);

    // Health amount
    if(this.health > 66 * this.area) {
      fill("green");
    }
    else if (this.health > 33 * this.area) {
      fill("orange");
    }
    else {
      fill("red");
    }
    rect(this.x, this.y - 15, this.health * this.spriteSize / this.maxHealth, 10);

  }
  // Moves enemy
  move() {
    if (this.x > 0 && this.direction === "left"){
      this.x -= this.speed;
    }
    else if (this.x <= 0 && this.direction === "left") {
      this.direction = "right";
    }
    
    if (this.x < width - sideBar.sideBarWidth - this.spriteSize && this.direction === "right"){
      this.x+= this.speed;
    } 
    
    else if (this.x >= width - sideBar.sideBarWidth - this.spriteSize && this.direction === "right") {
      this.direction = "left";
    }
    
  }

  // Checks if you are coliding with the player
  checkCollision(character) {
    if (this.x <= character.x + 5 && this.x >= character.x - 5 && this.y <= character.y + height/character.hitboxScale) {
      character.health -= this.enemyDamage;
    }
  }

  // Returns true and ups the kill counter if an enemy is dead
  isDead() {
    if (this.health <= 0) {
      character.enemyKills++;
      if (character.health < character.maxHealth){
        character.health += 5;
      }
      // upgrade your weapon
      if (character.enemyKills % 2 === 1 && weaponLevel < weaponsKey.length-1) {
        weaponLevel++;
        inventory[0].splice(0, 1, weaponsKey[weaponLevel]);
        character.weapon = weapons.get(inventory[0][0]);
      }

      return true;
    }
  }
}

// Loads images before startup.
function preload() {
  knightLeft1 = loadImage("assets/character/knightLeft1.png");
  knightLeft2 = loadImage("assets/character/knightLeft2.png");
  knightRight1 = loadImage("assets/character/knightRight1.png");
  knightRight2 = loadImage("assets/character/knightRight2.png");
  knightStill = loadImage("assets/character/knightStill.png");
  background1 = loadImage("assets/backgrounds/background1.png");
  background2 = loadImage("assets/backgrounds/background2.png");
  background3 = loadImage("assets/backgrounds/background3.png");
  background4 = loadImage("assets/backgrounds/background4.png");
  background5 = loadImage("assets/backgrounds/background5.png");
  background6 = loadImage("assets/backgrounds/background6.png");
  background7 = loadImage("assets/backgrounds/background7.png");
  background8 = loadImage("assets/backgrounds/background8.png");
  // Swords
  sword1 = loadImage("assets/items/swords/weapon1.png");
  sword2 = loadImage("assets/items/swords/weapon2.png");
  sword3 = loadImage("assets/items/swords/weapon3.png");
  sword4 = loadImage("assets/items/swords/weapon4.png"); 
  sword5 = loadImage("assets/items/swords/weapon5.png");
  sword6 = loadImage("assets/items/swords/weapon6.png");
  sword7 = loadImage("assets/items/swords/weapon7.png");
  sword8 = loadImage("assets/items/swords/weapon8.png");
  sword9 = loadImage("assets/items/swords/weapon9.png");
  sword10 = loadImage("assets/items/swords/weapon10.png");
  sword11 = loadImage("assets/items/swords/weapon11.png");
  sword12 = loadImage("assets/items/swords/weapon12.png"); 
  sword13 = loadImage("assets/items/swords/weapon13.png");
  sword14 = loadImage("assets/items/swords/weapon14.png");
  sword15 = loadImage("assets/items/swords/weapon15.png");
  sword16 = loadImage("assets/items/swords/weapon16.png");   
}

// Setup function runs once at the start of the program.
function setup() {
  if (windowHeight*2 > windowWidth) {
    createCanvas(windowWidth, windowWidth/2);
  }
  else{
    createCanvas(windowHeight*2 , windowHeight);
  }
  imageMode(CENTER);
  rectMode(CORNER);
  frameRate(30);
  
  backgrounds = [background1, background2, background3, background4, background5, background6, background7, background8];
  selectBackgrounds();
  backgroundColour = 0;
  sprites = [knightStill, knightLeft1, knightLeft2, knightRight1, knightRight2];
  character = new Player(sprites, inventory);
  sideBar = new PlayerMenu(sprites);
  character.x = width / 2;
  character.y = height / 2;

  weapons.set("Stick", [50000000, sword1]);
  weapons.set("Wooden Sword", [100, sword2]);
  weapons.set("Iron Sword", [200, sword3]);
  weapons.set("Gold Sword", [300, sword4]);
  weapons.set("Fancy Gold Sword", [400, sword5]);
  weapons.set("Cursed Gold Sword", [500, sword6]);
  weapons.set("Crystal Sword", [600, sword7]);
  weapons.set("Enchanted Crystal Sword", [700, sword8]);
  weapons.set("Magma Sword", [800, sword9]);
  weapons.set("Crystal Broad Sword", [900, sword10]);
  weapons.set("Enchanted Crystal Broad Sword", [1000, sword11]);
  weapons.set("Feiry Crystal Broad Sword", [1100, sword12]);
  weapons.set("Boss Sword 1", [1300, sword13]);
  weapons.set("Boss Sword 2", [1400, sword14]);
  weapons.set("Boss Sword 3", [1500, sword15]);
  weapons.set("Boss Sword 4", [1600, sword16]);
}

// Set to run 30 times a second.
function draw() {
  if (state === "start") {
    startScreen();
  } 
  else if (state === "play") {
    clear();
    displayBackground();
    
    // Uncomment next 2 lines to show character and ground hitbox.
    // rect(character.x, character.y, height/hitboxScale, height/hitboxScale);
    // line(0 - 10, height * 0.63, width + 10, height * 0.63);
    
    // Draws and moves sprite.
    character.displaySprite();
    character.handleMovement();
    character.applyGravity();
    character.nextScreen();
    

    handleEnemies();

    handleSidebar();

  }
  else if (state === "dead") {
    deathScreen();
  }
}

// Makes a start screen and makes any last preperations needed before entering the play state.
function startScreen() {
  enemies = [];
  push();
  background(backgroundColour);
  fill(255);
  textSize(35);
  text("click to start", width / 2, height / 2, 200, 100);
  if (mouseIsPressed && state === "start") {
    for (let i = 1; i < inventory.length; i++) {
      for (let j = 0; j < inventory[i].length; j++) {
        if (random(0,2) < 1) {
          inventory[i].splice(j, 1, new Potion("health"));
        }
        else {
          inventory[i].splice(j, 1, new Potion("damage"));
        }
      }
    }
    // inventory[1].splice(0, 1, new Potion("health"));
    state = "play";
  }
  pop();
}

// Makes a death screen. This should never show as I have not added a way to die.
function deathScreen() {
  clear();
  background(backgroundColour);
  fill(255);
  textSize(35);
  text("You Died", width / 2, height / 2, width/4, height/2);
}

// Selects which backgounds will be shown.
function selectBackgrounds() {
  backgroundSelection = [];
  // This loops however many times the height fits into the width rounded up. It then adds random numbers used to specify which backgrounds will be displayed and in what order. 
  for (let i = 0; i < Math.ceil(width / height); i++) {
    backgroundSelection.push(Math.floor(Math.random() * backgrounds.length)); 
  }
}

// Displays the bacground image.
function displayBackground() {
  
  for (let i = 0; i < Math.ceil(width / height); i++) {
    image(backgrounds[backgroundSelection[i]], height / 2 + height * i, height/2, height, height);
  }
}

// Handles all enemy actions ex.(displaying, moving, attacking, etc.).
function handleEnemies() {
  for(let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].display();
    enemies[i].checkCollision(character);
    enemies[i].move();
    if(enemies[i].isDead()) {
      enemies.splice(i, 1);
    }    

  }
}

// Spawns new enemies.
function spawnEnemies(direction) {
  enemies = [];
  for (let i = 0; i < areaCounter; i++) {
    enemies.push(new Enemy(areaCounter, 1, random(width * 0.33, width * 0.66), direction));
  }
}

// Calls all sidebar functions.
function handleSidebar(){
  sideBar.display();
  sideBar.healthBar();
  sideBar.displayInventory();
  sideBar.displayItems();
  sideBar.displayInfo();
}

// Sets movement variables to true based on key presses. The handleMovement function then uses these vairables for movement.
function keyPressed() {
  if (key === "a") {
    character.isMovingLeft = true;
  }
  if (key === "d") {
    character.isMovingRight = true;
  }
  if (keyCode === 32 && character.isGrounded) {
    character.initialY = character.y;
    character.isJumping = true;
  }
}

// Sets movement variables to false based on key release. The handleMovement function then uses these vairables for movement.
function keyReleased() {
  if (key === "a") {
    character.isMovingLeft = false;
  }
  if (key === "d") {
    character.isMovingRight = false;
  }
  if (keyCode === 32) {
    character.isJumping = false;
  }
}

// Function that is called every time you double click. Currently only used to consume potions. I need to redo this when I have the time.
function doubleClicked() {
  // Iterates once for all inventory slots not including the hotbar/equipped items.
  for (let i = 0; i < 6; i++) {
    // Checks if the mouse is within that inventory slot and if it is calls the useItem function with that slots location.
    if (mouseX > sideBar.inventoryCellLocation[i][0] && mouseX < sideBar.inventoryCellLocation[i][0] + sideBar.inventoryCellSize &&
      mouseY > sideBar.inventoryCellLocation[i][1] && mouseY < sideBar.inventoryCellLocation[i][1] + sideBar.inventoryCellSize) {
      sideBar.useItem(i);
    }
  }
}

// Function that is called once every time a mouse button is pressed.
function mousePressed() {
  if (state === "play" && mouseX < width - sideBar.sideBarWidth){
    character.attack();
  }
  // Sanity Check to make sure you arent already dragging an item.
  if (sideBar.isItemBeingDragged !== true) {
    // Iterates once for every inventory slot
    for (let i = 0; i < 6; i++) {
      if (mouseX > sideBar.inventoryCellLocation[i][0] && mouseX < sideBar.inventoryCellLocation[i][0] + sideBar.inventoryCellSize &&
         mouseY > sideBar.inventoryCellLocation[i][1] && mouseY < sideBar.inventoryCellLocation[i][1] + sideBar.inventoryCellSize) {
        sideBar.isItemBeingDragged = true;

        //  check if you are on the top row(slots 1,2,3 or inventory[1]) or the bottom row(slots 4,5,6 or inventory[2]) and drags that item
        if (i < 3) {

          sideBar.draggedItem = inventory[1][i % 3];
          sideBar.dragStartLocation = [[1],[i % 3]];
          inventory[1][i % 3].isBeingDragged = true;
        }
        else {
          sideBar.draggedItem = inventory[2][i % 3];
          sideBar.dragStartLocation = [[2],[i % 3]];
          inventory[2][i % 3].isBeingDragged = true;
        }
      }
    }
  }
}

function mouseReleased() {

  // If an item was being dragged sets a boolean to false to show that an item isn't being dragged.
  if (sideBar.isItemBeingDragged === true) {
    sideBar.isItemBeingDragged = false;
    // Iterates once for every inventory slot
    for (let i = 0; i < 6; i++) {
      // Check Location of the mouse
      if (mouseX > sideBar.inventoryCellLocation[i][0] && mouseX < sideBar.inventoryCellLocation[i][0] + sideBar.inventoryCellSize &&
         mouseY > sideBar.inventoryCellLocation[i][1] && mouseY < sideBar.inventoryCellLocation[i][1] + sideBar.inventoryCellSize) {
           
        // If you are in slots 0, 1, 2, the top row, get the x of your mouse, i%3, and set the y to 1.
        if (i < 3) {
          sideBar.dragItems(sideBar.dragStartLocation[1], sideBar.dragStartLocation[0], i % 3, 1);
        }

        // If you are in slots 3, 4, 5, the bottom row, get the x of your mouse, i%3, and set the y to 2.
        else {
          sideBar.dragItems(sideBar.dragStartLocation[1], sideBar.dragStartLocation[0], i % 3, 2);
        }

      }
    }
    // sets the isBeingDragged property of the item to false.
    sideBar.draggedItem.isBeingDragged = false;
  }
}
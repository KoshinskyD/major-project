let sounds = [];
let weaponSound1, weaponSound2, weaponSound3, weaponSound4, weaponSound5, weaponSound6, weaponSound7, weaponSound8;
let walkingSound;
let musicStartTime = 0;
let backgroundMusic;

// Background managment.
let background1, background2, background3, background4, background5, background6, background7, background8;
let backgrounds = [];
let backgroundSelection = [];
let backgroundColour;

// Counters used to change between sprites, screens/gamestates, and locations
let state = "start";
let areaCounter = 1;

// Scale
let scaler;
// Tutorial
let pressedA = false;
let pressedD = false;
let pressedSPACE = false;
let pressedENTER= false;


// Inventory
// ITMES
// Weapons


let sword1, sword2, sword3, sword4, sword5, sword6, sword7, sword8, sword9, sword10, sword11, sword12, sword13, sword14, sword15, sword16;
let weapons = new Map();
let weaponsKey = ["Stick", "Wooden Sword", "Iron Sword", "Gold Sword", "Fancy Gold Sword", "Cursed Gold Sword", "Crystal Sword", "Enchanted Crystal Sword", "Magma Sword", "Crystal Broad Sword", "Enchanted Crystal Broad Sword", "Feiry Crystal Broad Sword", "Boss Sword 1", "Boss Sword 2", "Boss Sword 3", "Boss Sword 4"];

class Sword {
  constructor(type) {
    this.name;
    this.damage;
    this.sprite;
    this.durability = 100;
    this.makeSword(type);
  }

  makeSword(type) {
    // ASK ABOUT RARITY IN DROPS/DAMAGE SCALING(EXPONENTIAL DAMAGE CURVE)
    this.damage = Math.round(random(areaCounter * 50, areaCounter * 75));

    
    if (type === undefined) {
      this.name = weaponsKey[Math.round(random(0, weaponsKey.length-1))];
    }
    else {
      this.name = type;
    }

    this.sprite = weapons.get(this.name);
  }

  display(x, y) {
    
    image(this.sprite, x, y, 30*scaler, 30 *scaler);
  }

}

let armour1, armour2, armour3;
let armours = new Map();
let armourKey = ["Obsidian Armour", "Fire Armour", "Iron Armour"];

class Armour {
  constructor (type) {
    this.name;
    this.defense;
    this.sprite;
    this.makeArmour(type);
  }

  makeArmour(type) {
    this.defense = Math.round(random(areaCounter - 1, areaCounter * 2));

    if (type === undefined) {
      this.name = armourKey[Math.round(random(0, armourKey.length-1))];
    }
    else {
      this.name = type;
    }

    this.sprite = armours.get(this.name);
  }

  display(x, y) {
    image(this.sprite, x, y, 60*scaler, 60 *scaler);
  }
}

let ring1, ring2, ring3;
let rings = new Map();
let ringKey = ["Ring of Health", "Ring of Defense", "Ring of Damage"];

class Ring {
  constructor (type) {
    this.name;
    this.bonusStat;
    this.sprite;
    this.type = type;
    this.makeRing();
  }

  makeRing() {
    this.bonusStat = Math.round(random(areaCounter - 1, areaCounter * 2));

    if (this.type === undefined) {
      this.name = ringKey[Math.round(random(0, ringKey.length-1))];
      this.type = this.name;
    }
    else {
      this.name = this.type;
    }

    this.sprite = rings.get(this.name);
  }

  display(x, y) {
    image(this.sprite, x, y, 60*scaler, 60 *scaler);
  }
}

// Potions
class Potion {
  constructor(type) {
    this.potionType = type;
    this.healthPotionSprite = loadImage("assets/items/healthPotion.png");
    this.damagePotionSprite = loadImage("assets/items/damagePotion.png");
    this.isBeingDragged = false;
    this.spriteSize = 30 * scaler;
    if (this.potionType === "Health") {
      this.sprite = this.healthPotionSprite;
      this.hp = 50;
    }
    else if (this.potionType === "Damage") {
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

// Inventory[0] is what is equipped, inventory[1] is your inventory.
// inventory[0][0] is weapon, inventory[0][1] is armour, inventory[0][2] is ring 
let inventory;
let sideBar; 
class PlayerMenu {
  constructor(sprites) {
    this.isItemBeingDragged = false;
    this.displayingBagInventory = false;
    this.borderColour = "black";
    this.sideBarWidth = width/ (5+1/3);
    this.healthBarX = width - this.sideBarWidth + 50 * scaler;
    this.healthBarY = 265 * scaler;
    this.healthBarWidth = 200 * scaler;
    this.healthBarHeight = 20 * scaler;
    this.inventoryCellSize = 50 * scaler;
    this.sprite = sprites[0];
    this.spriteY = height/6;
    this.tempInventory = [];
    this.inventoryCellLocation = [];
    this.hotbarCellLocation = [];
    this.bagCellLocation = [];
    this.dragStartLocation;
    this.draggedItem;
    this.cellX;
    this.cellY;
    this.bag;

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
    textSize(25 * scaler);
    text("Area: " + areaCounter, width - this.sideBarWidth /2, 50 * scaler);
    text("Kills:" + character.enemyKills, width - this.sideBarWidth / 2, 230 * scaler);
  
    // Character display.
    rectMode(CENTER);
    fill(180);
    rect(width - this.sideBarWidth/2, this.spriteY, 135* scaler, 135* scaler, 10);
    image(this.sprite, width - this.sideBarWidth/2, this.spriteY, 100 * scaler, 100 * scaler);
    pop();

  }

  // Player Health Bar
  healthBar() {
    rectMode(CORNER);
    // This draws the outline and the grey behind your health when you loose some HP
    fill(180);
    rect(this.healthBarX, this.healthBarY, this.healthBarWidth, this.healthBarHeight);
   
    // Changes the colour of your health bar depending on how much health you have. It changes every 1/3 of your max health you loose/
    if(character.health > character.maxHealth * (2/3) ) {
      fill("green");
    }
    else if (character.health > character.maxHealth * (1/3) ) {
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
    rect(width - this.sideBarWidth + 50 * scaler, 265 * scaler, ((character.health / character.maxHealth) * (200 * scaler) ), 20 * scaler);
  }

  // Inventory
  // This is currently using a bunch of magic numbers which are based around a screen size of 1578 x 789. I plan to change this when I have the time.
  displayInventory() {
    push();

    // Hotbar/equipped Items.
    // Makes the black border around the hotbar slots.
    fill("black");
    rect(width - 240 * scaler, 290 * scaler, 190* scaler, 70 * scaler, 15);
    // Hotbar Slots
    fill(80);
    for(let x = 1; x < inventory[0].length+1; x++) {
      // Location of the cell
      let equippedCellX = width - 290*scaler + (this.inventoryCellSize + this.inventoryCellSize/5) * x;
      let equippedCellY = 300 * scaler;
      // Drawing the cell
      rect(equippedCellX, equippedCellY, this.inventoryCellSize, this.inventoryCellSize, 15);
      if (this.hotbarCellLocation.length < 3) {
        this.hotbarCellLocation.push([equippedCellX, equippedCellY]);
      }
    }
    
    // Box surrounding the inventory slots.
    fill(this.borderColour);
    rect(width - 240 * scaler, 375 * scaler, 190 * scaler, 130 * scaler, 15);
    // boxes for inventoy slots


    rectMode(CORNER);
    fill(80);
    // Iterates through the inventory except for the hotbar/equipped items.
    for(let y = 1; y < 3  ; y++) {
      for(let x = 0; x < 3; x++) {
        // Sets the cell location.
        let cellX = width - 290*scaler + (this.inventoryCellSize + this.inventoryCellSize/5) * (x + 1);
        let cellY = 325 *scaler + (this.inventoryCellSize + this.inventoryCellSize/5) * y;
        // Draws the Cell
        rect(cellX, cellY, this.inventoryCellSize, this.inventoryCellSize, 15);
        if (this.inventoryCellLocation.length < 6) {
          this.inventoryCellLocation.push([cellX, cellY]);
        }
      }
    }
    pop();
  }

  // Loot Drops
  displayBagInventory() {
    this.displayingBagInventory = true;
    // Box surrounding the inventory slots.
    fill("black");
    rect(width - 240 * scaler, 565 * scaler, 190 * scaler, 130 * scaler, 15);

    // boxes for inventoy slots
    rectMode(CORNER);
    fill(80);
    // Iterates through the inventory except for the hotbar/equipped items.
    for(let y = 0; y < 2; y++) {
      for(let x = 0; x < 3; x++) {
        // Sets the cell location.
        let cellX = width - 290*scaler + (this.inventoryCellSize + this.inventoryCellSize/5) * (x + 1);
        let cellY = 575 *scaler + (this.inventoryCellSize + this.inventoryCellSize/5) * y;
        // Draws the Cell
        rect(cellX, cellY, this.inventoryCellSize, this.inventoryCellSize, 15);
        if (this.bagCellLocation.length < 6) {
          this.bagCellLocation.push([cellX, cellY]);
        }
      }
    }
  }
  
  // Loot Drops
  displayBagItmes(bag) {
    this.bag = bag;
    for (let i = 0; i < bag.items.length; i++) {
      if (bag.items[i] instanceof Potion) {
        bag.items[i].display(this.bagCellLocation, this.inventoryCellSize, i);
      }
    }
  }

  // Items
  displayItems(){
    // Equipment slots
    // Weapon 

    if (inventory[0][0] !== " ") {
      // Fills the slot with a color based on weapon equipped. This will eventually get replaced by a sprite but I did not have time to make one.
      imageMode(CENTER);
      inventory[0][0].display(this.hotbarCellLocation[0][0] + this.inventoryCellSize/2, this.hotbarCellLocation[0][1] + this.inventoryCellSize/2);
    }
    // Armour
    if (inventory[0][1] !== " ") {
      inventory[0][1].display(this.hotbarCellLocation[1][0] + this.inventoryCellSize/2, this.hotbarCellLocation[1][1] + this.inventoryCellSize/2);
    }
    // Ring
    if (inventory[0][2] !== " ") {
      inventory[0][2].display(this.hotbarCellLocation[2][0] + this.inventoryCellSize/2, this.hotbarCellLocation[2][1] + this.inventoryCellSize/2);
    }


    // Inventory Slots
    let cellCounter = 0;
    // iterates through your inventory slots and displays what item shoud be there
    for (let i = 0; i < inventory[1].length; i++) {
      // Checks if the inventory slot is empty
      if (inventory[1][i] !== " "){
        // displays item
        inventory[1][i].display(this.inventoryCellLocation, this.inventoryCellSize, cellCounter);
      }
      cellCounter++;
    }

  }
  
  // displays info about an item when you hover over it
  displayInfo() {

    // Health
    if (mouseX > this.healthBarX && mouseX < this.healthBarX + this.healthBarWidth &&
      mouseY > this.healthBarY && mouseY < this.healthBarY + this.healthBarHeight) {
      fill(120);
      textAlign(CENTER);
      textSize(15 * scaler);
      fill("black");
      text(character.health + "/" + character.maxHealth, this.healthBarX + 35 * scaler, this.healthBarY + 15 * scaler);
    }

    // Item Info Hotbar
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
        if (inventory[0][j] !== " ") {
          if (j === 0) {
            text(inventory[0][0].name, mouseX-75, mouseY-80, 80, 100);
            text("Damage: " + inventory[0][0].damage,  mouseX-75, mouseY - 20);
          }

          // Checks what armour is equipped and displays its info
          else if (j === 1) {
            text(inventory[0][1].name, mouseX-75, mouseY-80, 80, 100);
            text("+" + inventory[0][1].defense + " Defense",  mouseX-75, mouseY - 20);
          }

          // Checks what kind of ring is equipped and displays its bonus
          else {
            text(inventory[0][2].name, mouseX-75, mouseY-80, 80, 100);
            if (inventory[0][2].type === "Ring of Health") {
              text("+" + inventory[0][2].bonusStat + " Health",  mouseX-75, mouseY - 20);
            }

            else if (inventory[0][2].type === "Ring of Defense") {
              text("+" + inventory[0][2].bonusStat + " Defense",  mouseX-75, mouseY - 20);
            }

            else if (inventory[0][2].type === "Ring of Damage") {
              text("+" + inventory[0][2].bonusStat + " Damage",  mouseX-75, mouseY - 20);
            }
          }
        }
        else {
          text("Empty Slot", mouseX-75, mouseY-80, 80, 100);
        }
        pop();
      }
    }

    // Item Info Inventory Slots
    for (let i = 0; i < 6; i++) {
      // Checks if the mouse is within that inventory slot and if it is calls the useItem function with that slots location.
      if (mouseX > this.inventoryCellLocation[i][0] && mouseX < this.inventoryCellLocation[i][0] + this.inventoryCellSize &&
        mouseY > this.inventoryCellLocation[i][1] && mouseY < this.inventoryCellLocation[i][1] + this.inventoryCellSize) {
        push();
        textAlign(CENTER);
        textSize(20);

        if (inventory[1][i] instanceof Potion) {
          fill(120);
          rect(mouseX-150, mouseY-150, 150);
          fill("black");
          text(inventory[1][i].potionType + " Potion", mouseX-75, mouseY-80);
          if (inventory[1][i].potionType === "Damage"){
            text(inventory[1][i].hp + " HP",  mouseX-75, mouseY - 50);
          }
          else {
            text("+" + inventory[1][i].hp + " HP",  mouseX-75, mouseY - 50);
          }          
        }
        pop();
      }
    }

    // Bags
    if (this.displayingBagInventory) {
      for (let i = 0; i < 6; i++) {
      // Checks if the mouse is within that inventory slot and if it is calls the useItem function with that slots location.
        if (mouseX > this.bagCellLocation[i][0] && mouseX < this.bagCellLocation[i][0] + this.inventoryCellSize &&
              mouseY > this.bagCellLocation[i][1] && mouseY < this.bagCellLocation[i][1] + this.inventoryCellSize) {
          push();
          textAlign(CENTER);
          textSize(20);
      
          if (this.bag.items[i] instanceof Potion) {
            fill(120);
            rect(mouseX-150, mouseY-150, 150);
            fill("black");
            text(this.bag.items[i].potionType + " Potion", mouseX-75, mouseY-80);
            if (this.bag.items[i].potionType === "Damage"){
              text(this.bag.items[i].hp + " HP",  mouseX-75, mouseY - 50);
            }
            else {
              text("+" + this.bag.items[i].hp + " HP",  mouseX-75, mouseY - 50);
            }          
          }
          pop();
        }
      }
    }
  }

  // Use Items
  useItem(inventorySlot, bagType, bagNumber) {
    // inventory slot is a number from 0-5. 0 being the top left slot and 5 being the bottom right slot.
    if (bagType === "inventory") {

      // Sanity check to make sure you do not overheal above your maximum health.
      if (inventory[1][inventorySlot] instanceof Potion) {
        if (character.maxHealth - character.health < 50 && inventory[1][inventorySlot].potionType === "Health") {
          character.health = character.maxHealth;
        }
        // applies the potion affect which is +50hp for healing potions and - 50hp for damaging potions. 
        else{
          character.health += inventory[1][inventorySlot].hp;
        }
        // Sets that inventory slot to be a blank string or empty after an item has been used
        inventory[1].splice(inventorySlot, 1, " ");
      }
    }

    else if (bagType === "bag") {
      if (bags[bagNumber].items[inventorySlot] instanceof Potion) {

        if (character.maxHealth - character.health < 50 && bags[bagNumber].items[inventorySlot].potionType === "Health") {
          character.health = character.maxHealth;
        }
        // applies the potion affect which is +50hp for healing potions and - 50hp for damaging potions. 
        else{
          character.health += bags[bagNumber].items[inventorySlot].hp;
        }
        // Sets that inventory slot to be a blank string or empty after an item has been used
        bags[bagNumber].items.splice(inventorySlot, 1, " ");
      }
    }
  }

  // sideBar.dragItems( 0, 1 , 1, 1)
  dragItems(startSlot, endSlot, bagNumber) {
    this.tempInventory = [];
    if (bagNumber === undefined) {
      bagNumber = startSlot[2];
    }

    if (startSlot[1] ===  "inventory") {
      this.tempInventory.push(inventory[1][startSlot[0]]);
    }
    else {
      this.tempInventory.push(bags[bagNumber].items[startSlot[0]]);
    }
    if (endSlot[1] === "inventory") {
      this.tempInventory.push(inventory[1][endSlot[0]]);
    }
    else {
      this.tempInventory.push(bags[bagNumber].items[endSlot[0]]);
    }
    if (startSlot[1] ===  "inventory" && endSlot[1] === "inventory") {
      inventory[1].splice(startSlot[0], 1, this.tempInventory[1]);
      inventory[1].splice(endSlot[0], 1, this.tempInventory[0]); 
    }
    else if (startSlot[1] ===  "bag" && endSlot[1] === "bag" ) {
      bags[bagNumber].items.splice(startSlot[0], 1, this.tempInventory[1]);
      bags[bagNumber].items.splice(endSlot[0], 1, this.tempInventory[0]);
    }
    else if (startSlot[1] ===  "inventory" && endSlot[1] === "bag") {
      inventory[1].splice(startSlot[0], 1, this.tempInventory[1]);
      bags[bagNumber].items.splice(endSlot[0], 1, this.tempInventory[0]);
    }
    else if  (startSlot[1] ===  "bag" && endSlot[1] === "inventory"){
      bags[bagNumber].items.splice(startSlot[0], 1, this.tempInventory[1]);
      inventory[1].splice(endSlot[0], 1, this.tempInventory[0]); 
    }
  }

}

let bags = [];
let redBag;
let blackBag;
class ItemBag {
  constructor(bagLocation) {
    this.items = [];
    this.inventoryCellSize = 50 * scaler;  
    this.x = bagLocation;
    this.itemDrops();
  }
  // Determins what items are in the bag
  itemDrops() {
    if (Math.round(random(3)) === 1) {
      this.items.push(new Potion("Health"));
    }
    if (Math.round(random(5)) === 1) {
      this.items.push(new Potion("Damage"));
    }

    while (this.items.length < 6) {
      this.items.push(" ");
    }
  }

  hasItemsInside() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] !== " ") {
        return true;
      }
    }
    return false;
  }
  // Displays the bag sprite
  displayBag() {
    push();
    imageMode(CENTER);
    image(redBag, this.x + 40, height*0.6, 80 * scaler, 80 * scaler);
    pop();
  }

}

// Player managment
let sprites = [];
let knightLeft1, knightRight1, knightLeft2, knightRight2, knightStill;
let character;
class Player {
  constructor(sprites, inventory) {
    this.defaultHealth = 100;
    this.health = this.defaultHealth;
    this.maxHealth = this.health;
    this.defense = 0;
    // this.health = Infinity; // God Mode for testing
    this.weapon = inventory[0][0];
    this.armour = inventory[0][1];
    this.ring = inventory[0][2];
    this.playerDamage = 1 * this.weapon.damage;
    this.enemyKills = 0;
    
    
    //sprite managment
    this.playerSprite = sprites;
    this.spriteSelector = 0;
    this.hitboxScale = 9;
    this.spriteScale = 9;
    
    // Movement
    this.isSoundPlaying = false;
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

    this.updateEquipment();
  }
  // Draws Sprite depending on which way you are moving or if you are standing still. As well as plays the walking sound
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


    // Sound
    if (this.isMovingLeft && this.isGrounded && this.isSoundPlaying === false || this.isMovingRight && this.isGrounded && this.isSoundPlaying === false){
      walkingSound.loop();
      this.isSoundPlaying = true; 
    }

    else if (!this.isMovingRight && !this.isMovingLeft || !this.isGrounded) {
      walkingSound.pause();
      this.isSoundPlaying = false;
    }
  }

  // Applies gravity and checks if you are on the ground
  applyGravity() {
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
      if(areaCounter === 1) {
        character.health -= 50;
        inventory[1].splice(0, 1, new Potion("Health"));
      }
      this.x = 0;
      selectBackgrounds();
      areaCounter++;
      direction = "left";
      spawnEnemies(direction);
      bags = [];
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
        
        let randomNumber = Math.round(random(0, sounds.length-1));
        sounds[randomNumber].play();

        enemies[i].health -= this.playerDamage;
      }
    }
  }

  // Used to update what gear the character has equipped
  updateEquipment() {
    this.weapon = inventory[0][0];
    this.armour = inventory[0][1];
    this.ring = inventory[0][2];
    if (this.ring.type === "Ring of Damage"){
      this.playerDamage = 1 * this.weapon.damage + this.ring.bonusStat;
      this.maxHealth = this.defaultHealth;
      if (this.health >= this.defaultHealth) {
        this.health = this.defaultHealth;
      }
      this.defense = 0;
    }

    else  if (this.ring.type === "Ring of Health"){
      this.playerDamage = 1 * this.weapon.damage;
      this.maxHealth = this.defaultHealth + this.ring.bonusStat;
      this.health = this.health + this.ring.bonusStat;
      this.defense = 0;
    }
    else  if (this.ring.type === "Ring of Defense"){
      this.playerDamage = 1 * this.weapon.damage;
      this.maxHealth = this.defaultHealth;
      if (this.health >= this.defaultHealth) {
        this.health = this.defaultHealth;
      }
      this.defense = this.ring.bonusStat;
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
      character.health -= this.enemyDamage - character.defense;
    }
  }

  // Returns true and ups the kill counter if an enemy is dead
  isDead() {
    if (this.health <= 0) {
      character.enemyKills++;
      // upgrade your weapon
      if (Math.round(random(10)) === 1) {
        inventory[0].splice(0, 1, new Sword());
        character.updateEquipment(); 
      }
      if (Math.round(random(10)) === 1) {
        inventory[0].splice(2, 1, new Ring());
      }
      if (Math.round(random(1)) === 1) {
        inventory[0].splice(1, 1, new Armour());
      }
      bags.push(new ItemBag(this.x));
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
  // Armour
  armour1 = loadImage("assets/items/armour/armour1.png");
  armour2 = loadImage("assets/items/armour/armour2.png");
  armour3 = loadImage("assets/items/armour/armour3.png");
  // Rings
  ring1 = loadImage("assets/items/rings/health-ring.png");
  ring2 = loadImage("assets/items/rings/defense-ring.png");
  ring3 = loadImage("assets/items/rings/damage-ring.png");
  // Sounds
  soundFormats("wav", "mp3");
  weaponSound1 = loadSound("assets/sounds/attack/attackSound1.wav");
  weaponSound2 = loadSound("assets/sounds/attack/attackSound2.wav");
  weaponSound3 = loadSound("assets/sounds/attack/attackSound3.wav");
  weaponSound4 = loadSound("assets/sounds/attack/attackSound4.wav");
  weaponSound5 = loadSound("assets/sounds/attack/attackSound5.wav");
  weaponSound6 = loadSound("assets/sounds/attack/attackSound6.wav");
  weaponSound7 = loadSound("assets/sounds/attack/attackSound7.wav");
  weaponSound8 = loadSound("assets/sounds/attack/attackSound8.wav");
  walkingSound = loadSound("assets/sounds/walking/walking.wav");
  backgroundMusic = loadSound("assets/sounds/backgroundMusic.mp3");
  // Bags
  redBag = loadImage("assets/bags/redBag.png"); 
  blackBag = loadImage("assets/bags/blackBag.png");  
}

// Setup function runs once at the start of the program.
function setup() {
  if (windowHeight*2 > windowWidth) {
    createCanvas(windowWidth, windowWidth/2);
  }
  else{
    createCanvas(windowHeight*2 , windowHeight);
  }

  scaler = height/789;


  textAlign(CENTER);
  imageMode(CENTER);
  rectMode(CORNER);
  frameRate(30);
  
  backgrounds = [background1, background2, background3, background4, background5, background6, background7, background8];
  selectBackgrounds();
  backgroundColour = 0;

  sounds = [weaponSound1, weaponSound2, weaponSound3, weaponSound4, weaponSound5, weaponSound6, weaponSound7, weaponSound8];

  
  // Volumes
  walkingSound.setVolume(0.2);
  backgroundMusic.setVolume(0.2);
  for (let i = 0; i < sounds.length; i++) {
    sounds[i].setVolume(0.5);
  }

  weapons.set(weaponsKey[0], sword1);
  weapons.set(weaponsKey[1], sword2);
  weapons.set(weaponsKey[2], sword3);
  weapons.set(weaponsKey[3], sword4);
  weapons.set(weaponsKey[4], sword5);
  weapons.set(weaponsKey[5], sword6);
  weapons.set(weaponsKey[6], sword7);
  weapons.set(weaponsKey[7], sword8);
  weapons.set(weaponsKey[8], sword9);
  weapons.set(weaponsKey[9], sword10);
  weapons.set(weaponsKey[10], sword11);
  weapons.set(weaponsKey[11], sword12);
  weapons.set(weaponsKey[12], sword13);
  weapons.set(weaponsKey[13], sword14);
  weapons.set(weaponsKey[14], sword15);
  weapons.set(weaponsKey[15], sword16);

  armours.set(armourKey[0], armour1);
  armours.set(armourKey[1], armour2);
  armours.set(armourKey[2], armour3);


  rings.set(ringKey[0], ring1);
  rings.set(ringKey[1], ring2);
  rings.set(ringKey[2], ring3);
  
  inventory = [[new Sword(weaponsKey[0]), new Armour(armourKey[2]), new Ring()], [" ", " ", " ", " ", " ", " "]];
  
  sprites = [knightStill, knightLeft1, knightLeft2, knightRight1, knightRight2];
  character = new Player(sprites, inventory);
  character.x = width / 2;
  character.y = height / 2;

  sideBar = new PlayerMenu(sprites);
}

// Set to run 30 times a second.
function draw() {
  if (state === "start") {
    startScreen();
  } 
  else if (state === "play") {
    clear();
    displayBackground();
    playBackgroundMusic();

    // Draws and moves sprite.
    character.displaySprite();
    character.handleMovement();
    character.applyGravity();
    character.nextScreen();
    
    
    handleSidebar();

    for (let i = 0; i < bags.length; i++) {
      if (bags[i].hasItemsInside()) {
        bags[i].displayBag();
      }
    }
    handleEnemies();
    if (areaCounter <= 3) {
      tutorial();
    }
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
  text("Click to Start", width / 2, height / 2);
  if (mouseIsPressed && state === "start") {
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
  textAlign(CENTER);
  text("You are Dead", width/2, height/3);
  text("You Made it to Area " + areaCounter + " Defeating " + character.enemyKills + " Enemies", width / 2, height / 2);
  
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

// Plays the background music you hear while in the play state
function playBackgroundMusic() {
  if (millis() - musicStartTime >= 63372) {
    backgroundMusic.play();
    musicStartTime = millis();
  }
  else if(musicStartTime === 0) {
    backgroundMusic.play();
    musicStartTime = millis();
  }
}

// First 2 areas. Explains the game and how to play.
function tutorial() {
  push();
  let width = 800 * scaler;
  if (areaCounter === 1) {
    fill(158, 158, 158, 200);
    rect(180, 50, width, 200 * scaler, 15);
    textSize(25 * scaler);
    textAlign(CENTER);

    fill("black");
    if( !pressedA || !pressedD || !pressedSPACE) {
      text("The goal of this game is to run as far as you can.", 180, 80, width);
      text("Use A and D to move left and right.", 180, 120, width);
      text("Press and Hold SPACE to jump.", 180, 150, width);
    }

    else{
      text("Move Right to continue.", 180, 80, width);
      text("There is NO turning back.", 180, 120, width);
      text("Progress or Death.", 180, 160, width);
    }
  }
  else if (areaCounter === 2) {

    fill(158, 158, 158, 200);
    rect(180, 50, width, 200, 15);
    textSize(25);
    textAlign(CENTER);
    fill("black");
    if (inventory[1][0] !== " "){
      sideBar.borderColour = "white";
      text("Along your journy you will obtain Items.", 180, 80, width);
      text("These Items Will appear in your iventory on the right.", 180, 120, width);
      text("They will have many uses and can come in quite handy", 180, 160, width);
      text("Double Click the health potion to use it", 180, 190, width);
      pressedENTER = false;
    }
    else if (enemies.length > 0 && !pressedENTER) {
      sideBar.borderColour = "black";
      text("Along your journy you will also encounter Enemies", 180, 80, width);
      text("Running into them will damage you.", 180, 130, width);
      text("Take too much damage and you will die", 180, 160, width);
      text("(Press ENTER to continue)", 180, 200, width);
    }
    else if (enemies.length > 0 && pressedENTER) {
      text("Walk up to enemies and Left Click to attack.", 180, 80, width);
      text("Different Weapons will do more or less damage.", 180, 120, width);
      text("Kill all enemies for more items.", 180, 160, width);
    }
    else {
      character.health = character.maxHealth;
      text("You are ready to continue.", 180, 80, width);
      text("Good luck in your adventures.", 180, 150, width);
      text("And remember, there is no turning back", 180, 180, width);
    }
  }
  else if (areaCounter === 3) {
    sideBar.borderColour = "black";
  }
  pop();
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

  for (let i = 0; i < bags.length; i++) {
    if (character.x + 40 > bags[i].x && character.x < bags[i].x + 40 && bags[i].hasItemsInside()) {   
      sideBar.displayBagInventory(); 
      sideBar.displayBagItmes(bags[i]);
    }
  }
  sideBar.displayItems();
  sideBar.displayInfo();

}

// Sets movement variables to true based on key presses. The handleMovement function then uses these vairables for movement.
function keyPressed() {
  if (key === "a") {
    pressedA = true;
    character.isMovingLeft = true;
  }
  if (key === "d") {
    pressedD = true;
    character.isMovingRight = true;
  }
  if (keyCode === 32 && character.isGrounded) {
    pressedSPACE = true;
    character.initialY = character.y;
    character.isJumping = true;
  }
  if (keyCode === 13) {
    pressedENTER = true;
  }

  if (keyCode === 49) {
    sideBar.useItem(0, "inventory");
  }
  if (keyCode === 50) {
    sideBar.useItem(1, "inventory");
  }
  if (keyCode === 51) {
    sideBar.useItem(2, "inventory");
  }
  if (keyCode === 52) {
    sideBar.useItem(3, "inventory");
  }
  if (keyCode === 53) {
    sideBar.useItem(4, "inventory");
  }
  if (keyCode === 54) {
    sideBar.useItem(5, "inventory");
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
      sideBar.useItem(i, "inventory");
    }

    for (let j = 0; j < bags.length; j++) {
      if (character.x + 40 > bags[j].x && character.x < bags[j].x + 40 && bags[j].hasItemsInside()) {
        if (mouseX > sideBar.bagCellLocation[i][0] && mouseX < sideBar.bagCellLocation[i][0] + sideBar.inventoryCellSize &&
      mouseY > sideBar.bagCellLocation[i][1] && mouseY < sideBar.bagCellLocation[i][1] + sideBar.inventoryCellSize) {
          sideBar.useItem(i, "bag", j);
        }
      }
    }
  }
}

// Function that is called once every time a mouse button is pressed.
function mousePressed() {
  
  if (state === "play"){
    if (mouseX < width - sideBar.sideBarWidth){
      character.attack();
    }

    // Sanity Check to make sure you arent already dragging an item.
    if (sideBar.isItemBeingDragged !== true) {
      // Iterates once for every inventory slot
      for (let i = 0; i < 6; i++) {
        if (mouseX > sideBar.inventoryCellLocation[i][0] && mouseX < sideBar.inventoryCellLocation[i][0] + sideBar.inventoryCellSize &&
         mouseY > sideBar.inventoryCellLocation[i][1] && mouseY < sideBar.inventoryCellLocation[i][1] + sideBar.inventoryCellSize) {
          sideBar.isItemBeingDragged = true;
          if (inventory[1][i] !== " ") {
            sideBar.draggedItem = inventory[1][i];
  
            sideBar.dragStartLocation = [i, "inventory"];
            inventory[1][i].isBeingDragged = true;
          }
        }
      }

      // Item Bags
      for (let j = 0; j < bags.length; j++) {
        for (let i = 0; i < 6; i++) {
          if (character.x + 40 > bags[j].x && character.x < bags[j].x + 40 && bags[j].hasItemsInside()) {
            if (mouseX > sideBar.bagCellLocation[i][0] && mouseX < sideBar.bagCellLocation[i][0] + sideBar.inventoryCellSize &&
              mouseY > sideBar.bagCellLocation[i][1] && mouseY < sideBar.bagCellLocation[i][1] + sideBar.inventoryCellSize) {
              sideBar.isItemBeingDragged = true;

              // Checks if character is on a bag and if that bag has items in it.
              sideBar.draggedItem = bags[j].items[i];

              sideBar.dragStartLocation = [i, "bag", j];
              bags[j].items[i].isBeingDragged = true;
            }
          }
          else {
            bags[j].items[i].isBeingDragged = false;
          }
        }
      }
    }
  }
}

// Function that is called once every time a mouse button is released.
function mouseReleased() {
  if (state === "play") {
  // If an item was being dragged sets a boolean to false to show that an item isn't being dragged.
    if (sideBar.isItemBeingDragged === true) {
      sideBar.isItemBeingDragged = false;
      // Checks if the mouse is over the inventory
      for (let i = 0; i < 6; i++) {
        if (mouseX > sideBar.inventoryCellLocation[i][0] && mouseX < sideBar.inventoryCellLocation[i][0] + sideBar.inventoryCellSize &&
         mouseY > sideBar.inventoryCellLocation[i][1] && mouseY < sideBar.inventoryCellLocation[i][1] + sideBar.inventoryCellSize) {
          let dragEndLocation = [i, "inventory"];
          sideBar.dragItems(sideBar.dragStartLocation, dragEndLocation);
        }

      }


      
      for (let j = 0; j < bags.length; j++) {
        for (let i = 0; i < 6; i++) {
          if (character.x + 40 > bags[j].x && character.x < bags[j].x + 40 && bags[j].hasItemsInside()) {
            if (mouseX > sideBar.bagCellLocation[i][0] && mouseX < sideBar.bagCellLocation[i][0] + sideBar.inventoryCellSize &&
              mouseY > sideBar.bagCellLocation[i][1] && mouseY < sideBar.bagCellLocation[i][1] + sideBar.inventoryCellSize) {

              let dragEndLocation = [i, "bag"];
              sideBar.dragItems(sideBar.dragStartLocation, dragEndLocation, j);
            }
          }
        }
      }


      // sets the isBeingDragged property of the item to false.
      sideBar.draggedItem.isBeingDragged = false;
    }
  }
}
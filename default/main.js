let roleHarvester = require("role.harvester");
let roleUpgrader = require("role.upgrader");
let roleBuilder = require("role.builder");
let roleHauler = require("role.hauler");
let roleDefender = require("role.defender");
let towerControl = require("towerControl");

module.exports.loop = function () {
  let towers = _.filter(
    Game.structures,
    (s) => s.structureType === STRUCTURE_TOWER
  );
  towers.forEach((tower) => towerControl.run(tower));
  // Delete specific entries from Memory if they exist

  if (Game.time % 10 === 0) {
    for (let name in Game.rooms) {
      console.log(
        'Room "' +
          name +
          '" has ' +
          Game.rooms[name].energyAvailable +
          " energy"
      );
    }
    for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log("Clearing non-existing creep memory:", name);
      }
    }
  }

  let harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  let upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  let builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  let haulers = _.filter(Game.creeps, (creep) => creep.memory.role == "hauler");
  let defenders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "defender"
  );

  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == "hauler") {
      roleHauler.run(creep);
    }
    if (creep.memory.role == "defender") {
      roleDefender.run(creep);
    }
  }

  if (defenders.length < 3) {
    let newName = "MeleeDefender_" + Game.time;
    console.log("Spawning new defender: " + newName);
    Game.spawns["Spawn1"].spawnCreep(
      [
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
      ],
      newName,
      {
        memory: { role: "defender" },
      }
    );
  }

  if (haulers.length < 2) {
    let newName = "Hauler" + Game.time;
    console.log("Spawning new hauler: " + newName);
    console.log("Haulers: " + haulers.length);
    Game.spawns["Spawn1"].spawnCreep(
      [CARRY, CARRY, CARRY, CARRY, MOVE],
      newName,
      {
        memory: { role: "hauler" },
      }
    );
  }
  if (harvesters.length < 9) {
    let newName = "HarvesterBigger" + Game.time;
    console.log("Harvesters: " + harvesters.length);
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep(
      [
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        CARRY,
        MOVE,
        MOVE,
        MOVE,
      ],
      newName,
      {
        memory: { role: "harvester" },
      }
    );
  }

  // if (harvesters.length < 5) {
  //   let newName = "HarvesterBig" + Game.time;
  //   console.log("Harvesters: " + harvesters.length);
  //   console.log("Spawning new harvester: " + newName);
  //   Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName, {
  //     memory: { role: "harvester" },
  //   });
  // }

  if (harvesters.length < 2) {
    let newName = "Harvester" + Game.time;
    console.log("Harvesters: " + harvesters.length);
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester" },
    });
  }

  if (builders.length < 1) {
    let newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    console.log("Builders: " + builders.length);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "builder" },
    });
  }

  if (builders.length < 4) {
    let newName = "BuilderBigger" + Game.time;
    console.log("Spawning new builder: " + newName);
    console.log("Builders: " + builders.length);
    Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      newName,
      {
        memory: { role: "builder" },
      }
    );
  }

  //   if (upgraders.length < 1) {
  //      let newName = "Upgrader" + Game.time;
  //      console.log("Spawning new upgrader: " + newName);
  //      console.log("Upgraders: " + upgraders.length);
  //      Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
  //       memory: { role: "upgrader" },
  //      });
  //   }

  if (upgraders.length < 4) {
    let newName = "UpgraderBigger" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    console.log("Upgraders: " + upgraders.length);
    Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      newName,
      {
        memory: { role: "upgrader" },
      }
    );
  }
};

// console.log(JSON.stringify(Game.spawns, null, 2));
// console.log(JSON.stringify(Memory.creeps, null, 2));

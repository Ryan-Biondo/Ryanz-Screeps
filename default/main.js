let roleHarvester = require("role.harvester");
let roleUpgrader = require("role.upgrader");
let roleBuilder = require("role.builder");

module.exports.loop = function () {
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
  }

  if (harvesters.length < 2) {
    let newName = "Harvester" + Game.time;
    console.log("Harvesters: " + harvesters.length);
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester" },
    });
  }
  //     if(harvesters.length < 4) {
  //     let newName = 'HarvesterBig' + Game.time;
  //     console.log('Harvesters: ' + harvesters.length);
  //     console.log('Spawning new harvester: ' + newName);
  //     Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName,
  //     { memory: { role: 'harvester'} });
  // }

  if (upgraders.length < 1) {
    let newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    console.log("Upgraders: " + upgraders.length);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "upgrader" },
    });
  }

  // if(upgraders.length < 4) {
  //     let newName = 'UpgraderBig' + Game.time;
  //     console.log('Spawning new upgrader: ' + newName);
  //     console.log('Upgraders: ' + upgraders.length);
  //     Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE,MOVE], newName,
  //     { memory: { role: 'upgrader' } } );
  // }

  if (builders.length < 3) {
    let newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    console.log("Builders: " + builders.length);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "builder" },
    });
  }
  //     if(builders.length < 2) {
  //     let newName = 'BuilderBig' + Game.time;
  //     console.log('Spawning new builder: ' + newName);
  //     console.log('Builders: ' + builders.length);
  //     Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE,MOVE], newName,
  //     { memory: { role: 'builder' } } );
  // }

  const towers = _.filter(
    Game.structures,
    (s) => s.structureType === STRUCTURE_TOWER
  );
  towers.forEach((tower) => {
    let closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  });
};

// console.log(JSON.stringify(Game.spawns, null, 2));
// console.log(JSON.stringify(Memory.creeps, null, 2));

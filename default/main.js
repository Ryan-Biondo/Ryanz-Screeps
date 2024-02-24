var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    if (Game.time % 10 === 0) {
        for(var name in Game.rooms) {
            console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
        }
    }
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }


    // if(harvesters.length < 4) {
    //     var newName = 'HarvesterBig' + Game.time;
    //     console.log('Spawning new harvester: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, 
    //         {memory: {role: 'harvester'}});
    // }
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep( [WORK,CARRY,MOVE],
         'Upgrader',
    { memory: { role: 'upgrader' } } );
    }

    // if(upgraders.length < 2) {
    //     var newName = 'UpgraderBig' + Game.time;
    //     console.log('Spawning new harvester: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,CARRY,MOVE,MOVE],
    //      'UpgraderBig',
    // { memory: { role: 'upgrader' } } );
    // }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    if(builders.length < 8) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep( [WORK,CARRY,MOVE],
         'Builder',
    { memory: { role: 'builder' } } );
    }

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
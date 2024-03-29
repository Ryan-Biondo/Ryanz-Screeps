const roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      if (creep.fatigue == 0) creep.say("🔄 Harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      if (creep.fatigue == 0) creep.say("🚧 Build");
    }

    if (creep.memory.building) {
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#4CFF00" }, // Bright green for building
          });
        }
      } else {
        // No construction sites, check for structures needing repair
        let repairs = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax,
        });
        if (repairs.length) {
          repairs.sort((a, b) => a.hits - b.hits); // Prioritize the most damaged

          if (creep.memory.lastRepairTarget !== repairs[0].id) {
            creep.say("🔨 Repair");
            // Update lastRepairTarget in memory
            creep.memory.lastRepairTarget = repairs[0].id;
          }

          if (creep.repair(repairs[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(repairs[0], {
              visualizePathStyle: { stroke: "#FFD700" }, // Gold for repairing
            });
          }
        }
      }
    } else {
      let sources = creep.room.find(FIND_SOURCES);
      let sourceIndex =
        Array.from(creep.name).reduce(
          (acc, char) => acc + char.charCodeAt(0),
          0
        ) % sources.length;
      let source = sources[sourceIndex];
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: { stroke: "#00BFFF" }, // Deep sky blue for harvesting
        });
      }
    }
  },
};

module.exports = roleBuilder;

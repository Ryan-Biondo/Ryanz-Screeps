const roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      // If we're just starting to harvest, find a source
      if (!creep.memory.harvesting) {
        let sources = creep.room.find(FIND_SOURCES);
        let sourceIndex =
          Array.from(creep.name).reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          ) % sources.length;
        creep.memory.sourceId = sources[sourceIndex].id;
        creep.memory.harvesting = true; // Indicate we're in harvesting mode
        creep.memory.movingToSource = true; // Indicate we've started moving towards the source
      }

      // Display the "Harvest" message only once when we start moving towards the source
      if (creep.memory.movingToSource) {
        creep.say("🔄 Harvest");
        creep.memory.movingToSource = false; // Prevent message from repeating
      }

      const source = Game.getObjectById(creep.memory.sourceId);
      if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      // Once the creep starts delivering, clear the harvesting and movingToSource flags
      if (creep.memory.harvesting) {
        creep.memory.harvesting = false;
        creep.memory.movingToSource = undefined; // Ensure we can trigger the message again next cycle
        creep.say("🚚 Deliver");
      }

      // Find and move to the closest delivery target
      let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_TOWER ||
              structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });

      if (
        target &&
        creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  },
};

module.exports = roleHarvester;

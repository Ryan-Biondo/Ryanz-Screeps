const roleHauler = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // Determine hauling state based on carried energy
    if (creep.store.getUsedCapacity() > 0) {
      creep.memory.hauling = true;
    } else {
      creep.memory.hauling = false;
    }

    // Hauling state: Deliver resources
    if (creep.memory.hauling) {
      // Identify priority targets for energy delivery
      let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_SPAWN ||
                  structure.structureType === STRUCTURE_EXTENSION ||
                  structure.structureType === STRUCTURE_TOWER) &&
                  structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      // Deliver energy to the identified target
      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
          creep.say("🚚 Deliver");
        }
      } else {
        // Optional: Handle the case when no targets need energy
        creep.say("✅ All Full");
      }
    } else {
      // Not hauling: Collect energy from tombstones first, then storage
      let source = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
        filter: (t) => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      });

      if (!source) {
        source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
          filter: (r) => r.resourceType === RESOURCE_ENERGY
        });
      }

      if (!source && creep.room.storage && creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        source = creep.room.storage;
      }

      if (source) {
        if (source instanceof Resource) {
          if (creep.pickup(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            creep.say("🔄 Pickup");
          }
        } else {
          if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            creep.say("🔄 Collect");
          }
        }
      } else {
        // Optional: Idle behavior or return to a rally point
        creep.say("🔄 Searching");
      }
    }
  }
};

module.exports = roleHauler;

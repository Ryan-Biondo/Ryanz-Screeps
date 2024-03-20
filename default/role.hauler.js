const roleHauler = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // Check if the creep needs to refill energy
    if(creep.store.getUsedCapacity() === 0) {
      creep.memory.hauling = false;
    }
    if(creep.store.getFreeCapacity() > 0 && !creep.memory.hauling) {
      // Find the storage and retrieve energy
      var storage = creep.room.storage;
      if(storage && storage.store[RESOURCE_ENERGY] > 0) {
        if(creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
          creep.say("🔄 Collect"); // Added shoutout for collecting energy
        }
      }
    } else {
      // Set hauling to true if the creep is full
      creep.memory.hauling = true;
      // Prioritize spawns, extensions, then towers
      var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) &&
                       s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      });
      
      if(!target) {
        // If no spawn or extension needs energy, look for towers
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (s) => s.structureType == STRUCTURE_TOWER && 
                         s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
      }

      // Move to the target and transfer energy
      if(target) {
        if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
          creep.say("🚚 Deliver"); // Added shoutout for delivering energy
        }
      } else {
          creep.say("⏳ Waiting"); // Added shoutout for when there's no current task
      }
    }
  }
};

module.exports = roleHauler;

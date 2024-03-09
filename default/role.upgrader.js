const roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      if (creep.fatigue == 0) creep.say("🔄 Harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      if (creep.fatigue == 0) creep.say("⚡ Upgrade");
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
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
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
};

module.exports = roleUpgrader;

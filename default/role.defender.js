const roleDefender = {
  /** @param {Creep} creep **/
  run: function (creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (target) {
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ff0000" } }); // Red for combat
        }

        creep.say("⚔️ Engage!");
      }
    } else {
      // No hostiles, proceed to patrol
      creep.say("🛡️ Patrolling");
      this.patrol(creep);
    }
  },

  /** Patrol function for moving between flags **/
  patrol: function (creep) {
    const flags = creep.room
      .find(FIND_FLAGS)
      .filter((flag) => flag.name.startsWith("Patrol"));
    if (flags.length > 0) {
      if (
        !creep.memory.patrolPoint ||
        creep.memory.patrolPoint >= flags.length
      ) {
        creep.memory.patrolPoint = 0; // Reset if over the number of flags
      }
      const targetFlag = flags[creep.memory.patrolPoint];

      // Move to the flag if not in close proximity
      if (!creep.pos.inRangeTo(targetFlag, 3)) {
        // Consider being within 3 squares close enough
        creep.moveTo(targetFlag, { visualizePathStyle: { stroke: "#00ffff" } }); // Light blue for patrolling
      } else {
        // Increment patrol point if within proximity of the target flag
        creep.memory.patrolPoint++;
      }
    } else {
      // Move to a default position if no flags are found
      creep.moveTo(
        Game.spawns["Spawn1"].pos.x + 5,
        Game.spawns["Spawn1"].pos.y,
        { visualizePathStyle: { stroke: "#a3a3a3" } } // Grey for default
      );
    }
  },
};

module.exports = roleDefender;

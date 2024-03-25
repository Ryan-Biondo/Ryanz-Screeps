const roleClaimer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Target room name should be defined; for example, 'W8N3'
    const targetRoom = "TARGET_ROOM_NAME";

    // Check if the creep is in the target room
    if (creep.room.name !== targetRoom) {
      // Find exit to target room and move to it
      const exitDir = creep.room.findExitTo(targetRoom);
      const exit = creep.pos.findClosestByRange(exitDir);
      creep.moveTo(exit, { visualizePathStyle: { stroke: "#FFD700" } });
      creep.say("🚀 To Claim");
    } else {
      // If in the target room, attempt to claim the controller
      if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#FFD700" },
        });
        creep.say("🚩 Claim");
      }
    }
  },
};

module.exports = roleClaimer;

// Game.spawns['YourSpawnName'].spawnCreep([CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Claimer1', {memory: {role: 'claimer', targetRoom: 'TARGET_ROOM_NAME'}});

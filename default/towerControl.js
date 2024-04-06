const towerControl = {
  run: function (tower) {
    // Attack hostiles
    let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
      return;
    }

    // Heal creeps
    let closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax,
    });

    if (closestDamagedCreep) {
      tower.heal(closestDamagedCreep);
      return;
    }

    // Repair structures
    let closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
  },
};

module.exports = towerControl;

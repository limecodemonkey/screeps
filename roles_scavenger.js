var scavenger = {
	parts: [
		[Game.CARRY, Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE],
		[Game.CARRY, Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE, Game.CARRY, Game.MOVE]
	],

	action: function()
	{
		var creep = this.creep;

		var droppedEnergy = null;

		if (!creep.pos.findNearest(Game.HOSTILE_CREEPS)) {

			droppedEnergy = creep.pos.findNearest(Game.DROPPED_ENERGY, {
				filter: function(en) {
					var pickup = true;
					var tile = creep.room.lookAt(en);
					for(var i in tile) {
						if(tile[i].type == "creep" && tile[i].creep.memory && tile[i].creep.memory.role == "miner")
							pickup = false;
					}

					return pickup;
				}
			});
		}


		if(droppedEnergy === null || creep.energy == creep.energyCapacity)
		{
			if (creep.energy > 0) {
				var nearestSpawn = creep.pos.findNearest(Game.MY_SPAWNS, {
					filter: function(spawn)
					{
						return spawn.energy < spawn.energyCapacity;
					}
				});

				creep.moveTo(nearestSpawn);
				creep.transferEnergy(nearestSpawn);
			} else {
				this.rest();
			}
		}
		else
		{
			creep.moveTo(droppedEnergy);
			creep.pickup(droppedEnergy);
		}
	}
};

module.exports = scavenger;

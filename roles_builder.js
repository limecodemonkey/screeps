/**
 * @TODO: Make it more carry heavy, make it have helpers
 * @type {{parts: *[], getParts: getParts, action: action}}
 */
var builder = {
	parts: [
		[Game.WORK,Game.WORK,Game.CARRY,Game.CARRY,Game.MOVE]
		// [Game.WORK,Game.WORK,Game.WORK, Game.CARRY,Game.CARRY,Game.MOVE]
//		[Game.WORK,Game.WORK,Game.CARRY,Game.CARRY,Game.MOVE, Game.MOVE, Game.CARRY, Game.MOVE],
//		[Game.WORK,Game.WORK,Game.CARRY,Game.CARRY,Game.MOVE, Game.MOVE, Game.CARRY, Game.MOVE, Game.WORK],
//		[Game.WORK,Game.WORK,Game.CARRY,Game.CARRY,Game.MOVE, Game.MOVE, Game.CARRY, Game.MOVE, Game.WORK, Game.MOVE],
//		[Game.WORK,Game.WORK,Game.CARRY,Game.CARRY,Game.MOVE, Game.MOVE, Game.CARRY, Game.MOVE, Game.WORK, Game.MOVE, Game.CARRY]
	],

	action: function()
	{
		var creep = this.creep;

		//If out of energy, go to spawn and recharge
		if(creep.energy === 0) {
			var closestSpawn = creep.pos.findNearest(Game.MY_SPAWNS, {
				filter: function(spawn)
				{
					return spawn.energy > spawn.energyCapacity * 0.1;
				}
			});

			if(closestSpawn) {
				creep.moveTo(closestSpawn);
				closestSpawn.transferEnergy(creep);
			} else {
				creep.moveTo(creep.pos.findNearest(Game.MY_SPAWNS));
			}
		}
		else {
			//First, we're going to check for damaged ramparts. We're using ramparts as the first line of defense
			//and we want them nicely maintained. This is especially important when under attack. The builder will
			//repair the most damaged ramparts first
			var structures = creep.room.find(Game.STRUCTURES);
			var damagedRamparts = [ ];

			for(var index in structures)
			{
				if(structures[index].structureType == Game.STRUCTURE_RAMPART
				&& structures[index].hits < (structures[index].hitsMax - 50))
					damagedRamparts.push(structures[index]);
			}

			damagedRamparts.sort(function(a, b)
			{
				return(a.hits - b.hits);
			});

			if(damagedRamparts.length)
			{
				creep.moveTo(damagedRamparts[0]);
				creep.repair(damagedRamparts[0]);

				return;
			}

			//Next we're going to look for general buildings that have less than 50% health, and we'll go to repair those.
			//We set it at 50%, because we don't want builders abandoning their duty every time a road gets walked on
			var halfBroken = creep.room.find(Game.STRUCTURES);
			var toRepair = [ ];
			for(var i in halfBroken)
				if((halfBroken[i].hits / halfBroken[i].hitsMax) < 0.5)
					toRepair.push(halfBroken[i]);

			if(toRepair.length)
			{
				var structure = toRepair[0];
				creep.moveTo(structure);
				creep.repair(structure);

				return;
			}

			//If no repairs are needed, we're just going to go find some structures to build
			var targets = creep.room.find(Game.CONSTRUCTION_SITES);
			if(targets.length) {
				var site = targets[0];
				if(!creep.pos.isNearTo(site))
					creep.moveTo(site);

				if(creep.pos.inRangeTo(site, 0))
					creep.suicide();

				creep.build(site);
				return;
			}

			var target = this.rangedAttack();
			if(target)
			{
				this.kite(target);
			}

			this.rest(true);
		}
	}
};

module.exports = builder;

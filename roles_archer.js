var proto = require('role_prototype');

var archer = {
	parts: [
		[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE],
		[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE],
		[Game.TOUGH, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE],
		[Game.TOUGH, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE],
		[Game.TOUGH, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE],
	],

	/**
	 * @TODO: We need to get archers to prioritise their targets better
	 */
	action: function()
	{
		var creep = this.creep;

		var target = this.getRangedTarget();
		if(target !== null)
			creep.rangedAttack(target);

		//If there's not a target near by, let's go search for a target if need be
		if(target === null)
			return this.rest();

		this.kite(target);
		creep.rangedAttack(target);
	}
};

module.exports = archer;

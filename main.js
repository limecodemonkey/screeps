Memory.debug = false;
Memory.info = true;

var start = new Date();
var statLength = 20;
var ecoIndex = Game.time%statLength;
var energyStored = 0;
var energyMax = 0;
Memory.flagCount = 0;
if (!('eco' in Memory)) Memory.eco = {};
if (!('values' in Memory.eco)) Memory.eco.values = {};
if (!('deltas' in Memory.eco)) Memory.eco.deltas = {};
Memory.eco.values[ecoIndex] = 0;
Memory.eco.deltas[ecoIndex] = 0;

var performRoles = require('performRoles');
var spawner = require('spawner');
var countType = require('countType');
var factory = require('factory');

for (var i in Game.flags) {
	Memory.flagCount++;
}

factory.init();
factory.run();

spawner.spawnNextInQue();

factory.buildArmyWhileIdle();

performRoles(Game.creeps);

for(var sName in Game.spawns) {

	var spawn = Game.spawns[sName];
	if(spawn.energy) {
		Memory.eco.values[ecoIndex]+=spawn.energy;
		energyStored += spawn.energy;
		energyMax += spawn.energyCapacity;
	}
}


var finish = new Date();
if(Memory.info) {
	var prevInd = ecoIndex-1;
	if (prevInd == -1) prevInd = statLength-1;
	var average = 0;
	var percent = Math.round(100*energyStored/energyMax);
	for(var x = 0; x < statLength; x++) {
		average += Memory.eco.deltas[x];
	}
	average = Math.round(average / statLength);
	if(!average) average = 0;
	if(!percent) percent = 0;
	Memory.eco.deltas[ecoIndex]=
		Memory.eco.values[ecoIndex]
		- Memory.eco.values[prevInd];

	console.log('TICK: ' + (finish.getTime() - start.getTime())+'ms, ECO: [ '+average+'/t, '+percent+'% ]');
	console.log('==============================');
}

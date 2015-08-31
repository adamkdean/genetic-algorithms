'use strict';

var algorithm = require('./algorithm');

algorithm.run({
    target: 'Lorem ipsum',
    mutationChance: 0.05,
    generationSize: 8,
    generationCap: 1000000
});

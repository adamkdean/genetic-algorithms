'use strict';

var algorithm = require('./algorithm');

algorithm.run({
    target: 'This is a very long sentence',
    mutationChance: 0.1,
    generationSize: 8,
    generationCap: 1000000
});

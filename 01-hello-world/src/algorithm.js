'use strict';

var _ = require('lodash');

(function(exports) {

    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ',
        target = 'Hello world',
        mutationChance = 0.05,
        generationSize = 8,
        generationCap = 1000000,
        generations = [];

    // calculateFitness:
    // lower is better, zero is identical
    let calculateFitness = function (str) {
        let fitness = 0;
        for (let i = 0; i < str.length; i++) {
            let t = target.charCodeAt(i),
                s = str.charCodeAt(i);
            fitness += Math.abs(t - s);
        }
        return fitness;
    };

    let generateString = function (length) {
        let array = [];
        for (let i = 0; i < length; i++) {
            let c = Math.floor(Math.random() * alphabet.length);
            array.push(alphabet[c]);
        }
        return array.join('');
    };

    let runGeneration = function (index) {
        let generation = [];

        // go through each individual in this generation and
        // calculate it's fitness, pushing that to an array
        for (let i = 0; i < generations[index].length; i++) {
            let individual = generations[index][i],
                fitness = calculateFitness(individual);

            generation.push({
                individual: individual,
                fitness: fitness
            });
        }

        // now sort the generation and take the top half
        // and throw away the bottom half of individuals
        generation = _.sortBy(generation, 'fitness').splice(0, generation.length / 2);

        // console log the most successful individual from this generation
        console.log('[%s] Most promising individual: %s (%s)',
            index, generation[0].individual, generation[0].fitness);

        // remove fitness value now
        generation = _.pluck(generation, 'individual');

        // add surviving individuals to the next generation
        generations[index + 1] = [...generation];

        // loop through surviving individuals and create two offspring per pair
        for (let i = 0; i < generation.length - 2; i++) {
            let parentA = generation[i],
                parentB = generation[i + 1],
                childA = reproduce(parentA, parentB),
                childB = reproduce(parentA, parentB);
            generations[index + 1].push(childA, childB);
        }

        // return our current generation so that
        // main can check if we've won
        return generations[index];
    };

    let reproduce = function (parentA, parentB) {
        // the first step will be to merge the two parents by
        // way of a random two point crossover
        let length = parentA.length,
            crossoverPoint = Math.floor(Math.random() * (length - 1)) + 1,
            crossoverLength = Math.floor(Math.random() * (length - crossoverPoint)) + 1,
            insertionPoint = Math.floor(Math.random() * (length - crossoverLength)),
            splice = parentB.substr(crossoverPoint, crossoverLength),
            child = parentA.substr(0, insertionPoint) + splice + parentA.substr(insertionPoint + crossoverLength);

        // next we'll go through each gene and apply the mutationChance, if
        // mutation is successful, the gene will be replaced with the new gene
        //console.log('pre-mutation  %s', child);
        for(let i = 0; i < child.length; i++) {
            if (Math.random() < mutationChance) {
                child = child.substr(0, i) + generateString(1) + child.substr(i + 1);
            }
        }
        //console.log('post-mutation %s (%s)', child, mCount);

        return child;
    };

    let main = function () {
        // first we need to initialise our first generation
        // we'll just take X random strings and take it from there
        generations[0] = [];
        for (let i = 0; i < generationSize; i++) {
            let s = generateString(target.length);
            generations[0].push(s);
        }

        // now we'll run through the generations and process them
        // before the end of each run, the next generation will be populated
        for (let generationIndex = 0; generationIndex < generationCap; generationIndex++) {
            let thisGeneration = runGeneration(generationIndex);
            if (_.includes(thisGeneration, target)) {
                console.log('Done!');
                break;
            }
        }
    };

    exports.run = function (opts) {
        // target: must consist of values available in variable `alphabet`
        // generationSize: must be an even number, must be more than 2
        target = opts.target || target;
        generationSize = opts.generationSize || generationSize;
        generationCap = opts.generationCap || generationCap;
        mutationChance = opts.mutationChance || mutationChance;
        main();
    }

})(module.exports);

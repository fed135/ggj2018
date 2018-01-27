/**
 * Match store
 */

'use strict';

/* Local variables -----------------------------------------------------------*/

const Matches = {};

/* Methods -------------------------------------------------------------------*/

function add(name) {
	const ret = Promise.defer();

	// Check if match exist
	if (!Matches.hasOwnProperty(name)) _push(name, ret);
	else ret.reject('Match already exists with that name');

	return ret.promise;
}

function get(name) {
	const ret = Promise.defer();

	if (Matches.hasOwnProperty(name)) ret.resolve(Matches[name]);
	else ret.reject('No match with that name'); 

	return ret.promise;
}

function clean(name) {
	delete Matches[name];
	return Promise.resolve();
}

function _push(name, ret) {
	Matches[name] = {
		players: [],
		state: 'lobby',
		name
	};

	ret.resolve(Matches[name]);
}

function get_or_make(name) {
	return get(name)
		.then(null, () => add(name));
}

/* Exports -------------------------------------------------------------------*/

module.exports = { add, get, clean, get_or_make };
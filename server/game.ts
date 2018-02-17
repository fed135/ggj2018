import Player from "./player/Player";
import {Input} from "./player/types";
import {values} from "lodash";

const crypto = require('crypto');

export const getMostVotedInputs = (inputs: Input[][]): Input[] => {

  const voteAccumulator = [];
  const inputValues = values(Input);
  const baseMoves: { [input: string]: number } = {};
  inputValues.forEach((input: Input) => {
    baseMoves[input] = 0;
  });


  // Accumulate each input in order and count how many player voted for that input
  inputs[0].forEach((input: Input, inputIndex: number) => {
    inputs.forEach((inputs: Input[]) => {
      voteAccumulator[inputIndex] = voteAccumulator[inputIndex] || {...baseMoves};
      voteAccumulator[inputIndex][inputs[inputIndex]] = voteAccumulator[inputIndex][inputs[inputIndex]] || 0;
      voteAccumulator[inputIndex][inputs[inputIndex]]++;
    });
  });

  // For each input, find out which one has more votes
  return voteAccumulator.map(
    (moves: { [input: string]: number }) => (
      <Input>inputValues.reduce(
        (previousInput: Input, currentInput: Input) => (
          moves[currentInput] > moves[previousInput]
            ? currentInput
            : previousInput
        ))
    ));
};

export const input = async (player: Player, direction: Input) => {
  player.addInput(direction);
};

export const isVoteOver = async (inputs: Input[][]): Promise<boolean> => {
  return inputs
    .map(actions => actions.length)
    .every(length => length >= Player.maxMovePerTurn);
};

// export const move = (player: Player) => (request) => {
//   console.log(player.getId(), 'move', request.body);
//   request.client.server.connections.forEach((connection) => {
//     if (connection.match === request.body.match && request.session.role === 'spectate') {
//       player.move(request.body.move);
//       connection.write('player.move', request.body);
//     }
//   });
// };
//
// export const punch = (player) => (request) => {
//   console.log(player, 'punch', request.body);
//   request.client.server.connections.forEach((connection) => {
//     if (connection.match === request.body.match && request.session.role === 'spectate') {
//       connection.write('player.punch', request.body);
//     }
//   });
// };

export const spawn = (player) => (request) => {
  console.log(player, 'spawn', request.body);
  request.session.player = request.body.player || crypto.randomBytes(20).toString('hex');
  request.body.player = request.session.player;

  request.client.server.connections.forEach((connection) => {
    if (connection.match === request.body.match && request.session.role === 'spectate') {
      connection.write('player.spawn', request.body);
    }
  });
};

export const vibrate = (player) => (request) => {
  console.log(player, 'vibrate', request.body);
  request.client.server.connections.forEach((connection) => {
    if (connection.match === request.body.match && connection.color === player.color) {
      connection.write('player.vibrate', request.body);
    }
  });
};

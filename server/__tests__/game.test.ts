import 'mocha';
import {Input} from "../player/types";
import {expect} from 'chai';
import {getMostVotedInputs} from "../game";

describe('server', () => {
  it('input should be properly parsed', () => {
    const mockedInputs: Input[][] = [
      [Input.UP, Input.LEFT, Input.UP, Input.LEFT, Input.RIGHT],
      [Input.UP, Input.LEFT, Input.UP, Input.LEFT, Input.RIGHT],
      [Input.RIGHT, Input.DOWN, Input.RIGHT, Input.RIGHT, Input.RIGHT]
    ];

    const expectedResult: Input[] = [Input.UP, Input.LEFT, Input.UP, Input.LEFT, Input.RIGHT];
    expect(getMostVotedInputs(mockedInputs)).to.deep.equal(expectedResult)
  });
});



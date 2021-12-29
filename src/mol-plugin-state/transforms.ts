/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */
// file | url -> Data
import * as Data from './transforms/data';
// others
import * as Misc from './transforms/misc';
// Data -> Traj -> Model -> Structure
import * as Model from './transforms/model';
// Ccp4等 -> Volume.Data
import * as Volume from './transforms/volume';
// Structure -> Representation3D
// Representation3D -> Representation3DState
// Volume.Data -> Volume.Representation3D
import * as Representation from './transforms/representation';
import * as Shape from './transforms/shape';

export const StateTransforms = {
    Data,
    Misc,
    Model,
    Volume,
    Representation,
    Shape
};

export type StateTransforms = typeof StateTransforms
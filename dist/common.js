"use strict";
/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const name = 'actions-on-google';
/** @hidden */
exports.debug = Debug(`${name}:debug`);
/** @hidden */
exports.warn = Debug(`${name}:warn`);
/** @hidden */
exports.error = console.error.bind(console);
/** @hidden */
exports.info = console.log.bind(console);
exports.warn.log = exports.error;
exports.debug.log = exports.info;
/** @hidden */
exports.deprecate = (feature, alternative) => exports.info(`${feature} is *DEPRECATED*: ${alternative}`);
/** @hidden */
exports.values = (o) => Object.keys(o).map(k => o[k]);
/** @hidden */
exports.clone = (o) => JSON.parse(JSON.stringify(o));
/** @hidden */
// tslint:disable-next-line:no-any root can by anything
exports.stringify = (root, ...exclude) => {
    const excluded = new Set(exclude);
    const filtered = Object.keys(root).reduce((o, k) => {
        if (excluded.has(k)) {
            o[k] = '[Excluded]';
            return o;
        }
        const value = root[k];
        try {
            JSON.stringify(value);
            o[k] = value;
            return o;
        }
        catch (e) {
            o[k] = `[Stringify Error] ${e}`;
            return o;
        }
    }, {});
    return JSON.stringify(filtered, null, 2);
};
/** @hidden */
exports.toArray = (a) => Array.isArray(a) ? a : [a];
//# sourceMappingURL=common.js.map
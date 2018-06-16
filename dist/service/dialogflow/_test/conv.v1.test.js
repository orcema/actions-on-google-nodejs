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
const ava_1 = require("ava");
const conv_1 = require("../conv");
const test = ava_1.default;
test.beforeEach(t => {
    t.context.conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
        headers: {},
    });
});
test('conv can be instantiated', t => {
    t.true(t.context.conv instanceof conv_1.DialogflowConversation);
});
//# sourceMappingURL=conv.v1.test.js.map
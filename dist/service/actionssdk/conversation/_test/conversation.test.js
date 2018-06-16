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
const conversation_1 = require("../conversation");
ava_1.default('conv.screen is true when screen capability exists', t => {
    const conv = new conversation_1.Conversation({
        headers: {},
        request: {
            surface: {
                capabilities: [
                    {
                        name: 'actions.capability.SCREEN_OUTPUT',
                    },
                ],
            },
        },
    });
    t.true(conv.screen);
});
ava_1.default('conv.screen is false when screen capability does not exist', t => {
    const conv = new conversation_1.Conversation({
        headers: {},
        request: {
            surface: {
                capabilities: [],
            },
        },
    });
    t.false(conv.screen);
});
//# sourceMappingURL=conversation.test.js.map
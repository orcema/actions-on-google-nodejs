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
const conversation_1 = require("./conversation");
/** @public */
class ActionsSdkConversation extends conversation_1.Conversation {
    /** @public */
    constructor(options) {
        super({
            request: options.body,
            headers: options.headers,
        });
        this.body = options.body;
        const { body = {}, init } = options;
        const { inputs = [] } = body;
        const [firstInput = {}] = inputs;
        const { intent = '' } = firstInput;
        const { conversation = {} } = body;
        const { conversationToken } = conversation;
        this.intent = intent;
        this.data = conversationToken ? JSON.parse(conversationToken).data : ((init && init.data) || {});
    }
    /** @public */
    serialize() {
        if (this._raw) {
            return this._raw;
        }
        const { richResponse, expectUserResponse, userStorage, expectedIntent, } = this.response();
        const inputPrompt = {
            richInitialPrompt: richResponse,
        };
        const possibleIntents = [expectedIntent || {
                intent: 'actions.intent.TEXT',
            }];
        const expectedInput = {
            inputPrompt,
            possibleIntents,
        };
        const conversationToken = JSON.stringify({ data: this.data });
        return {
            expectUserResponse,
            expectedInputs: expectUserResponse ? [expectedInput] : undefined,
            finalResponse: expectUserResponse ? undefined : { richResponse },
            conversationToken,
            userStorage,
        };
    }
}
exports.ActionsSdkConversation = ActionsSdkConversation;
//# sourceMappingURL=conv.js.map
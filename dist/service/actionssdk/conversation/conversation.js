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
const surface_1 = require("./surface");
const user_1 = require("./user");
const response_1 = require("./response");
const question_1 = require("./question");
const argument_1 = require("./argument");
const device_1 = require("./device");
const input_1 = require("./input");
/** @public */
class Conversation {
    /** @hidden */
    constructor(options) {
        /** @public */
        this.responses = [];
        /** @public */
        this.expectUserResponse = true;
        /** @public */
        this.digested = false;
        /** @hidden */
        this._responded = false;
        const { request, headers, init } = options;
        this.request = request;
        this.headers = headers;
        this.sandbox = !!this.request.isInSandbox;
        const { inputs = [], conversation = {} } = this.request;
        const [input = {}] = inputs;
        const { rawInputs = [] } = input;
        this.input = new input_1.Input(rawInputs[0]);
        this.surface = new surface_1.Surface(this.request.surface);
        this.available = new surface_1.Available(this.request.availableSurfaces);
        this.user = new user_1.User(this.request.user, init && init.storage);
        this.arguments = new argument_1.Arguments(input.arguments);
        this.device = new device_1.Device(this.request.device);
        this.id = conversation.conversationId;
        this.type = conversation.type;
        this.screen = this.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    }
    /** @public */
    json(json) {
        this._raw = json;
        this._responded = true;
        return this;
    }
    /** @public */
    add(...responses) {
        if (this.digested) {
            throw new Error('Response has already been sent. ' +
                'Is this being used in an async call that was not ' +
                'returned as a promise to the intent handler?');
        }
        this.responses.push(...responses);
        this._responded = true;
        return this;
    }
    /**
     * Asks to collect user's input. All user's queries need to be sent to the app.
     * {@link https://developers.google.com/actions/policies/general-policies#user_experience|
     *     The guidelines when prompting the user for a response must be followed at all times}.
     *
     * @example
     * ```javascript
     *
     * // Actions SDK
     * const app = actionssdk()
     *
     * app.intent('actions.intent.MAIN', conv => {
     *   const ssml = '<speak>Hi! <break time="1"/> ' +
     *     'I can read out an ordinal like <say-as interpret-as="ordinal">123</say-as>. ' +
     *     'Say a number.</speak>'
     *   conv.ask(ssml)
     * })
     *
     * app.intent('actions.intent.TEXT', (conv, input) => {
     *   if (input === 'bye') {
     *     return conv.close('Goodbye!')
     *   }
     *   const ssml = `<speak>You said, <say-as interpret-as="ordinal">${input}</say-as></speak>`
     *   conv.ask(ssml)
     * })
     *
     * // Dialogflow
     * const app = dialogflow()
     *
     * app.intent('Default Welcome Intent', conv => {
     *   conv.ask('Welcome to action snippets! Say a number.')
     * })
     *
     * app.intent('Number Input', (conv, {num}) => {
     *   conv.close(`You said ${num}`)
     * })
     * ```
     *
     * @param responses A response fragment for the library to construct a single complete response
     * @public
     */
    ask(...responses) {
        this.expectUserResponse = true;
        return this.add(...responses);
    }
    /**
     * Have Assistant render the speech response and close the mic.
     *
     * @example
     * ```javascript
     *
     * // Actions SDK
     * const app = actionssdk()
     *
     * app.intent('actions.intent.MAIN', conv => {
     *   const ssml = '<speak>Hi! <break time="1"/> ' +
     *     'I can read out an ordinal like <say-as interpret-as="ordinal">123</say-as>. ' +
     *     'Say a number.</speak>'
     *   conv.ask(ssml)
     * })
     *
     * app.intent('actions.intent.TEXT', (conv, input) => {
     *   if (input === 'bye') {
     *     return conv.close('Goodbye!')
     *   }
     *   const ssml = `<speak>You said, <say-as interpret-as="ordinal">${input}</say-as></speak>`
     *   conv.ask(ssml)
     * })
     *
     * // Dialogflow
     * const app = dialogflow()
     *
     * app.intent('Default Welcome Intent', conv => {
     *   conv.ask('Welcome to action snippets! Say a number.')
     * })
     *
     * app.intent('Number Input', (conv, {num}) => {
     *   conv.close(`You said ${num}`)
     * })
     * ```
     *
     * @param responses A response fragment for the library to construct a single complete response
     * @public
     */
    close(...responses) {
        this.expectUserResponse = false;
        return this.add(...responses);
    }
    /** @public */
    response() {
        if (!this._responded) {
            throw new Error('No response has been set. ' +
                'Is this being used in an async call that was not ' +
                'returned as a promise to the intent handler?');
        }
        if (this.digested) {
            throw new Error('Response has already been digested');
        }
        this.digested = true;
        const { expectUserResponse } = this;
        let richResponse = new response_1.RichResponse();
        let expectedIntent;
        for (const response of this.responses) {
            if (typeof response === 'string') {
                richResponse.add(response);
                continue;
            }
            if (response instanceof question_1.Question) {
                expectedIntent = response;
                if (response instanceof question_1.SoloQuestion) {
                    // SoloQuestions don't require a SimpleResponse
                    // but API still requires a SimpleResponse
                    // so a placeholder is added to not error
                    // It won't show up to the user as PLACEHOLDER
                    richResponse.add('PLACEHOLDER');
                }
                continue;
            }
            if (response instanceof response_1.RichResponse) {
                richResponse = response;
                continue;
            }
            if (response instanceof response_1.Suggestions) {
                if (!richResponse.suggestions) {
                    richResponse.suggestions = [];
                }
                richResponse.suggestions.push(...response.suggestions);
                continue;
            }
            if (response instanceof response_1.Image) {
                richResponse.add(new response_1.BasicCard({ image: response }));
                continue;
            }
            if (response instanceof response_1.MediaObject) {
                richResponse.add(new response_1.MediaResponse(response));
                continue;
            }
            richResponse.add(response);
        }
        const userStorage = this.user._serialize();
        return {
            expectUserResponse,
            richResponse,
            userStorage,
            expectedIntent,
        };
    }
}
exports.Conversation = Conversation;
//# sourceMappingURL=conversation.js.map
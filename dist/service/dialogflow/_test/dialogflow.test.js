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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const dialogflow_1 = require("../dialogflow");
const common_1 = require("../../../common");
const google_auth_library_1 = require("google-auth-library");
const test = ava_1.default;
test.beforeEach(t => {
    t.context.app = dialogflow_1.dialogflow();
});
test('app is a function', t => {
    t.is(typeof t.context.app, 'function');
});
test('app.debug is false when not passed options', t => {
    t.false(t.context.app.debug);
});
test('app.debug is true when passed true', t => {
    const app = dialogflow_1.dialogflow({ debug: true });
    t.true(app.debug);
});
test('app without any handlers throws error', (t) => __awaiter(this, void 0, void 0, function* () {
    yield t.throws(t.context.app.handler({
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, {}));
}));
test('app sets handler using app.intent', t => {
    const intent = 'abc123';
    const handler = () => { };
    t.context.app.intent(intent, handler);
    t.is(t.context.app._handlers.intents[intent], handler);
});
test('app gets simple response string when using app.intent', (t) => __awaiter(this, void 0, void 0, function* () {
    const intent = 'abc123';
    const response = 'abcdefg1234567';
    const session = 'abcdefghijk';
    t.context.app.intent(intent, conv => conv.ask(response));
    const res = yield t.context.app.handler({
        session,
        queryResult: {
            intent: {
                displayName: intent,
            },
        },
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, {});
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
                userStorage: '{"data":{}}',
            },
        },
        outputContexts: [
            {
                name: `${session}/contexts/_actions_on_google`,
                lifespanCount: 99,
                parameters: {
                    data: '{}',
                },
            },
        ],
    });
}));
test('app throws error when intent handler throws error', (t) => __awaiter(this, void 0, void 0, function* () {
    const intent = 'abc123';
    const error = 'abcdefg1234567';
    const session = 'abcdefghijk';
    t.context.app.intent(intent, conv => {
        throw new Error(error);
    });
    const res = yield t.throws(t.context.app.handler({
        session,
        queryResult: {
            intent: {
                displayName: intent,
            },
        },
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, {}));
    t.is(res.message, error);
}));
test('app sets catcher using app.catch', t => {
    const catcher = () => { };
    t.context.app.catch(catcher);
    t.is(t.context.app._handlers.catcher, catcher);
});
test('app uses catcher when intent handler throws error', (t) => __awaiter(this, void 0, void 0, function* () {
    const intent = 'abc123';
    const response = 'abcdefg1234567';
    const session = 'abcdefghijk';
    const error = 'abcdefg1234567abc';
    t.context.app.intent(intent, conv => {
        throw new Error(error);
    });
    t.context.app.catch((conv, e) => {
        t.is(e.message, error);
        conv.ask(response);
    });
    const res = yield t.context.app.handler({
        session,
        queryResult: {
            intent: {
                displayName: intent,
            },
        },
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, {});
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
                userStorage: '{"data":{}}',
            },
        },
        outputContexts: [
            {
                name: `${session}/contexts/_actions_on_google`,
                lifespanCount: 99,
                parameters: {
                    data: '{}',
                },
            },
        ],
    });
}));
test('app sets fallback using app.fallback', t => {
    const fallback = () => { };
    t.context.app.fallback(fallback);
    t.is(t.context.app._handlers.fallback, fallback);
});
test('app uses fallback when no intent handler', (t) => __awaiter(this, void 0, void 0, function* () {
    const response = 'abcdefg1234567';
    const session = 'abcdefghijk';
    t.context.app.fallback(conv => {
        conv.ask(response);
    });
    const res = yield t.context.app.handler({
        session,
        queryResult: {},
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, {});
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
                userStorage: '{"data":{}}',
            },
        },
        outputContexts: [
            {
                name: `${session}/contexts/_actions_on_google`,
                lifespanCount: 99,
                parameters: {
                    data: '{}',
                },
            },
        ],
    });
}));
test('app adds middleware using app.middleware', t => {
    const middleware = () => { };
    t.context.app.middleware(middleware);
    t.deepEqual(t.context.app._middlewares, [middleware]);
});
test('app uses middleware', (t) => __awaiter(this, void 0, void 0, function* () {
    const response = 'abcdefg1234567';
    const middleware = conv => Object.assign(conv, {
        test() {
            conv.ask(response);
        },
    });
    const app = dialogflow_1.dialogflow();
    app._middlewares.push(middleware);
    const session = 'abcdefghijk';
    app.fallback(conv => {
        conv.test();
    });
    const res = yield app.handler({
        session,
        queryResult: {},
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, {});
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
                userStorage: '{"data":{}}',
            },
        },
        outputContexts: [
            {
                name: `${session}/contexts/_actions_on_google`,
                lifespanCount: 99,
                parameters: {
                    data: '{}',
                },
            },
        ],
    });
}));
test('app works when validation is valid headers', (t) => __awaiter(this, void 0, void 0, function* () {
    const response = 'abcdefg1234567';
    const session = 'abcdefghijk';
    const verification = {
        key: 'value',
    };
    const app = dialogflow_1.dialogflow({
        verification,
    });
    app.fallback(conv => {
        conv.ask(response);
    });
    const res = yield app.handler({
        session,
        queryResult: {},
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, verification);
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
                userStorage: '{"data":{}}',
            },
        },
        outputContexts: [
            {
                name: `${session}/contexts/_actions_on_google`,
                lifespanCount: 99,
                parameters: {
                    data: '{}',
                },
            },
        ],
    });
}));
test('app throws error when verification headers is not provided', (t) => __awaiter(this, void 0, void 0, function* () {
    const response = 'abcdefg1234567';
    const session = 'abcdefghijk';
    const verification = {
        key: 'value',
    };
    const app = dialogflow_1.dialogflow({
        verification,
    });
    app.fallback(conv => {
        conv.ask(response);
    });
    const res = yield app.handler({
        session,
        queryResult: {},
        originalDetectIntentRequest: {
            payload: {
                isInSandbox: true,
            },
        },
    }, {});
    t.is(res.body.error, 'A verification header key was not found');
}));
test('app.intent using array sets intent handlers for each', t => {
    const intents = ['intent1', 'intent2'];
    const handler = conv => {
    };
    t.context.app.intent(intents, handler);
    t.is(t.context.app._handlers.intents[intents[0]], handler);
    t.is(t.context.app._handlers.intents[intents[1]], handler);
});
test('auth config is set correctly with clientId', t => {
    const id = 'test';
    const app = dialogflow_1.dialogflow({
        clientId: id,
    });
    t.true(app._client instanceof google_auth_library_1.OAuth2Client);
    t.is(app.auth.client.id, id);
});
test('auth config is not set with no clientId', t => {
    const app = dialogflow_1.dialogflow();
    t.is(typeof app._client, 'undefined');
    t.is(typeof app.auth, 'undefined');
});
//# sourceMappingURL=dialogflow.test.js.map
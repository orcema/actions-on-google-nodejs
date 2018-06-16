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
const context_1 = require("../context");
const incoming_1 = require("../incoming");
const common_1 = require("../../../common");
const actionssdk_1 = require("../../actionssdk");
const test = ava_1.default;
test.beforeEach(t => {
    t.context.request = {
        isInSandbox: true,
    };
    t.context.body = {
        originalDetectIntentRequest: {
            payload: t.context.request,
        },
    };
    t.context.conv = new conv_1.DialogflowConversation({
        body: t.context.body,
        headers: {},
    });
});
test('conv can be instantiated', t => {
    t.true(t.context.conv instanceof conv_1.DialogflowConversation);
});
test('conv.request is set correctly', t => {
    t.is(t.context.conv.request, t.context.request);
});
test('conv.body is set correctly', t => {
    t.is(t.context.conv.body, t.context.body);
});
test('conv.action is parsed correctly', t => {
    const action = 'abc123';
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                action,
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    t.is(conv.action, action);
});
test('conv.intent is parsed correctly', t => {
    const intent = 'abc123';
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                intent: {
                    displayName: intent,
                },
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    t.is(conv.intent, intent);
});
test('conv.parameters is parsed correctly', t => {
    const parameters = {
        a: '1',
        b: '2',
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                parameters,
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    t.is(conv.parameters, parameters);
});
test('conv.contexts is an instance of ContextValues', t => {
    t.true(t.context.conv.contexts instanceof context_1.ContextValues);
});
test('conv.incoming is an instance of Incoming', t => {
    t.true(t.context.conv.incoming instanceof incoming_1.Incoming);
});
test('conv.query is parsed correctly', t => {
    const query = 'abc123';
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                queryText: query,
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    t.is(conv.query, query);
});
test('conv.data is parsed correctly', t => {
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                outputContexts: [{
                        name: '_actions_on_google',
                        parameters: {
                            data: JSON.stringify(data),
                        },
                    }],
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    t.deepEqual(conv.data, data);
});
test('conv.version is detected correctly to be 2', t => {
    t.is(t.context.conv.version, 2);
});
test('conv.followup sets the raw json correctly with no parameters', t => {
    const lang = 'ab-CD';
    const event = 'abc_123';
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                languageCode: lang,
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    conv.followup(event);
    t.deepEqual(common_1.clone(conv._raw), {
        followupEventInput: {
            name: event,
            languageCode: lang,
        },
    });
});
test('conv.followup sets the raw json correctly with parameters', t => {
    const lang = 'ab-CD';
    const event = 'abc_123';
    const parameters = {
        a: '1',
        b: '2',
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                languageCode: lang,
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    conv.followup(event, parameters);
    t.deepEqual(conv._raw, {
        followupEventInput: {
            name: event,
            languageCode: lang,
            parameters,
        },
    });
});
test('conv.followup sets the raw json correctly with parameters and lang', t => {
    const lang = 'ef-GH';
    const event = 'abc_123';
    const parameters = {
        a: '1',
        b: '2',
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            queryResult: {
                languageCode: 'ab-CD',
            },
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    conv.followup(event, parameters, lang);
    t.deepEqual(conv._raw, {
        followupEventInput: {
            name: event,
            languageCode: lang,
            parameters,
        },
    });
});
test('conv.serialize returns the raw json when set with conv.json', t => {
    const json = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    t.context.conv.json(json);
    t.deepEqual(t.context.conv.serialize(), json);
});
test('conv.serialize returns the correct response with simple response string', t => {
    const response = 'abc123';
    const session = 'abcdefg1234567';
    const conv = new conv_1.DialogflowConversation({
        body: {
            session,
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    conv.add(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: 'abc123',
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
});
test('conv.serialize returns the correct response with simple response string and set data', t => {
    const response = 'abc123';
    const session = 'abcdefg1234567';
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            session,
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    conv.data = data;
    conv.add(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
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
                    data: JSON.stringify(data),
                },
            },
        ],
    });
});
test('conv.serialize returns the correct response with permission response', t => {
    const session = 'abcdefg1234567';
    const conv = new conv_1.DialogflowConversation({
        body: {
            session,
            originalDetectIntentRequest: {
                payload: {},
            },
        },
        headers: {},
    });
    conv.ask(new actionssdk_1.Permission({
        permissions: 'NAME',
        context: 'To read your mind',
    }));
    t.deepEqual(common_1.clone(conv.serialize()), {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: 'PLACEHOLDER',
                            },
                        },
                    ],
                },
                userStorage: '{"data":{}}',
                systemIntent: {
                    intent: 'actions.intent.PERMISSION',
                    data: {
                        '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                        optContext: 'To read your mind',
                        permissions: [
                            'NAME',
                        ],
                    },
                },
            },
        },
        outputContexts: [
            {
                name: 'abcdefg1234567/contexts/_actions_on_google',
                lifespanCount: 99,
                parameters: {
                    data: '{}',
                },
            },
        ],
    });
});
//# sourceMappingURL=conv.test.js.map
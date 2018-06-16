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
const actionssdk_1 = require("../actionssdk");
const google_auth_library_1 = require("google-auth-library");
const CONVERSATION_ID = '1234';
const USER_ID = 'abcd';
function buildRequest(convType, intent, data) {
    const appRequest = {
        conversation: {
            conversationId: CONVERSATION_ID,
            type: convType,
            conversationToken: data,
        },
        user: {
            userId: USER_ID,
            locale: 'en_US',
        },
        inputs: [
            {
                intent,
                rawInputs: [
                    {
                        inputType: 'KEYBOARD',
                        query: 'Talk to my test app',
                    },
                ],
            },
        ],
        surface: {
            capabilities: [
                {
                    name: 'actions.capability.SCREEN_OUTPUT',
                },
                {
                    name: 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    name: 'actions.capability.WEB_BROWSER',
                },
                {
                    name: 'actions.capability.AUDIO_OUTPUT',
                },
            ],
        },
        availableSurfaces: [
            {
                capabilities: [
                    {
                        name: 'actions.capability.SCREEN_OUTPUT',
                    },
                    {
                        name: 'actions.capability.AUDIO_OUTPUT',
                    },
                ],
            },
        ],
    };
    return appRequest;
}
ava_1.default('intent handler is invoked', (t) => {
    const app = actionssdk_1.actionssdk();
    let invoked = false;
    const intentHandler = (conv) => {
        invoked = true;
        return conv.ask('hello');
    };
    app.intent('intent.foo', intentHandler);
    const promise = app.handler(buildRequest('NEW', 'intent.foo'), {});
    return promise.then((result) => {
        t.is(result.status, 200);
        t.true(invoked);
    });
});
ava_1.default('fallback handler is invoked', t => {
    const app = actionssdk_1.actionssdk();
    let intentInvoked = false;
    let fallbackInvoked = false;
    const intentHandler = (conv) => {
        intentInvoked = true;
        return conv.ask('hello');
    };
    const fallbackHandler = (conv) => {
        fallbackInvoked = true;
        return conv.ask('fallback');
    };
    app.intent('intent.foo', intentHandler);
    app.intent('intent.bar', intentHandler);
    app.fallback(fallbackHandler);
    const promise = app.handler(buildRequest('NEW', 'some.other.intent'), {});
    return promise.then((result) => {
        t.is(result.status, 200);
        t.false(intentInvoked);
        t.true(fallbackInvoked);
    });
});
ava_1.default('middleware is used', t => {
    const app = actionssdk_1.actionssdk();
    let middlewareUsed = false;
    app.intent('intent.foo', (conv) => {
        return conv.close('hello');
    });
    app.use(() => {
        middlewareUsed = true;
    });
    const promise = app.handler(buildRequest('NEW', 'intent.foo'), {});
    return promise.then((result) => {
        t.is(result.status, 200);
        t.true(middlewareUsed);
    });
});
ava_1.default('app.intent using array sets intent handlers for each', t => {
    const app = actionssdk_1.actionssdk();
    const intents = ['intent1', 'intent2'];
    const handler = conv => {
    };
    app.intent(intents, handler);
    t.is(app._handlers.intents[intents[0]], handler);
    t.is(app._handlers.intents[intents[1]], handler);
});
ava_1.default('auth config is set correctly with clientId', t => {
    const id = 'test';
    const app = actionssdk_1.actionssdk({
        clientId: id,
    });
    t.true(app._client instanceof google_auth_library_1.OAuth2Client);
    t.is(app.auth.client.id, id);
});
ava_1.default('auth config is not set with no clientId', t => {
    const app = actionssdk_1.actionssdk();
    t.is(typeof app._client, 'undefined');
    t.is(typeof app.auth, 'undefined');
});
//# sourceMappingURL=actionssdk.test.js.map
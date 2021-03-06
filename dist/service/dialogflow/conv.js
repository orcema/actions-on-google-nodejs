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
const actionssdk_1 = require("../actionssdk");
const context_1 = require("./context");
const incoming_1 = require("./incoming");
const APP_DATA_CONTEXT = '_actions_on_google';
const APP_DATA_CONTEXT_LIFESPAN = 99;
const isV1 = (body) => !!body.result;
const getRequest = (body) => {
    if (isV1(body)) {
        const { originalRequest = {} } = body;
        const { data = {} } = originalRequest;
        return data;
    }
    return body.originalDetectIntentRequest.payload;
};
/** @public */
class DialogflowConversation extends actionssdk_1.Conversation {
    /** @public */
    constructor(options) {
        super({
            request: getRequest(options.body),
            headers: options.headers,
            init: options.init,
        });
        const { body, init } = options;
        this.body = body;
        if (isV1(this.body)) {
            this.version = 1;
            const { result = {} } = this.body;
            const { action = '', parameters = {}, contexts, resolvedQuery = '', metadata = {}, fulfillment, } = result;
            const { intentName = '' } = metadata;
            this.action = action;
            this.intent = intentName;
            this.parameters = parameters;
            this.contexts = new context_1.ContextValues(contexts);
            this.incoming = new incoming_1.Incoming(fulfillment);
            this.query = resolvedQuery;
        }
        else {
            this.version = 2;
            const { queryResult = {} } = this.body;
            const { action = '', parameters = {}, outputContexts, intent = {}, queryText = '', fulfillmentMessages, } = queryResult;
            const { displayName = '' } = intent;
            this.action = action;
            this.intent = displayName;
            this.parameters = parameters;
            this.contexts = new context_1.ContextValues(outputContexts, this.body.session);
            this.incoming = new incoming_1.Incoming(fulfillmentMessages);
            this.query = queryText;
        }
        for (const key in this.parameters) {
            const value = this.parameters[key];
            if (typeof value !== 'object') {
                // Convert all non-objects to strings for consistency
                this.parameters[key] = String(value);
            }
        }
        this.data = (init && init.data) || {};
        const context = this.contexts.input[APP_DATA_CONTEXT];
        if (context) {
            const { data } = context.parameters;
            if (typeof data === 'string') {
                this.data = JSON.parse(data);
            }
        }
    }
    /**
     * Triggers an intent of your choosing by sending a followup event from the webhook.
     *
     * @example
     * ```javascript
     *
     * const app = dialogflow()
     *
     * // Create a Dialogflow intent with event 'apply-for-license-event'
     *
     * app.intent('Default Welcome Intent', conv => {
     *   conv.followup('apply-for-license-event', {
     *     date: new Date().toISOString(),
     *   })
     *   // The dialogflow intent with the 'apply-for-license-event' event
     *   // will be triggered with the given parameters `date`
     * })
     * ```
     *
     * @param event Name of the event
     * @param parameters Parameters to send with the event
     * @param lang The language of this query.
     *     See {@link https://dialogflow.com/docs/languages|Language Support}
     *     for a list of the currently supported language codes.
     *     Note that queries in the same session do not necessarily need to specify the same language.
     *     By default, it is the languageCode sent with Dialogflow's queryResult.languageCode
     * @public
     */
    followup(event, parameters, lang) {
        if (this.version === 1) {
            return this.json({
                followupEvent: {
                    name: event,
                    data: parameters,
                },
            });
        }
        const body = this.body;
        return this.json({
            followupEventInput: {
                name: event,
                parameters,
                languageCode: lang || body.queryResult.languageCode,
            },
        });
    }
    /** @public */
    serialize() {
        if (this._raw) {
            return this._raw;
        }
        const { richResponse, expectUserResponse, userStorage, expectedIntent, } = this.response();
        const google = {
            expectUserResponse,
            richResponse,
            userStorage,
            systemIntent: expectedIntent && {
                intent: expectedIntent.intent,
                data: expectedIntent.inputValueData,
            },
        };
        const payload = {
            google,
        };
        this.contexts.set(APP_DATA_CONTEXT, APP_DATA_CONTEXT_LIFESPAN, {
            data: JSON.stringify(this.data),
        });
        if (this.version === 1) {
            const contextOut = this.contexts._serializeV1();
            const response = {
                data: payload,
                contextOut,
            };
            return response;
        }
        const outputContexts = this.contexts._serialize();
        const response = {
            payload,
            outputContexts,
        };
        return response;
    }
}
exports.DialogflowConversation = DialogflowConversation;
//# sourceMappingURL=conv.js.map
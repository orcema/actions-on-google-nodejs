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
const question_1 = require("../question");
const option_1 = require("./option");
/**
 * Asks to collect user's input with a carousel.
 *
 * @example
 * ```javascript
 *
 * // Actions SDK
 * const app = actionssdk()
 *
 * app.intent('actions.intent.MAIN', conv => {
 *   conv.ask('Which of these looks good?')
 *   conv.ask(new Carousel({
 *     items: {
 *       [SELECTION_KEY_ONE]: {
 *         title: 'Number one',
 *         description: 'Description of number one',
 *         synonyms: ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'],
 *       },
 *       [SELECTION_KEY_TWO]: {
 *         title: 'Number two',
 *         description: 'Description of number one',
 *         synonyms: ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'],
 *       }
 *     }
 *   }))
 * })
 *
 * app.intent('actions.intent.OPTION', (conv, input, option) => {
 *   if (option === SELECTION_KEY_ONE) {
 *     conv.close('Number one is a great choice!')
 *   } else {
 *     conv.close('Number two is also a great choice!')
 *   }
 * })
 *
 * // Dialogflow
 * const app = dialogflow()
 *
 * app.intent('Default Welcome Intent', conv => {
 *   conv.ask('Which of these looks good?')
 *   conv.ask(new Carousel({
 *     items: {
 *       [SELECTION_KEY_ONE]: {
 *         title: 'Number one',
 *         description: 'Description of number one',
 *         synonyms: ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'],
 *       },
 *       [SELECTION_KEY_TWO]: {
 *         title: 'Number two',
 *         description: 'Description of number one',
 *         synonyms: ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'],
 *       }
 *     }
 *   }))
 * })
 *
 * // Create a Dialogflow intent with the `actions_intent_OPTION` event
 * app.intent('Get Option', (conv, input, option) => {
 *   if (option === SELECTION_KEY_ONE) {
 *     conv.close('Number one is a great choice!')
 *   } else {
 *     conv.close('Number two is also a great choice!')
 *   }
 * })
 * ```
 *
 * @public
 */
class Carousel extends question_1.Question {
    /**
     * @param options Carousel option
     * @public
     */
    constructor(options) {
        super('actions.intent.OPTION');
        this._data('type.googleapis.com/google.actions.v2.OptionValueSpec', {
            carouselSelect: {
                items: Array.isArray(options.items) ? options.items : option_1.convert(options.items),
                imageDisplayOptions: options.display,
            },
        });
    }
}
exports.Carousel = Carousel;
//# sourceMappingURL=carousel.js.map
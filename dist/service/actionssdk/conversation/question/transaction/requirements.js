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
/**
 * Checks whether user is in transactable state.
 * @public
 */
class TransactionRequirements extends question_1.SoloQuestion {
    /**
     * @param options The raw {@link GoogleActionsV2TransactionRequirementsCheckSpec}
     * @public
     */
    constructor(options) {
        super('actions.intent.TRANSACTION_REQUIREMENTS_CHECK');
        this._data('type.googleapis.com/google.actions.v2.TransactionRequirementsCheckSpec', options);
    }
}
exports.TransactionRequirements = TransactionRequirements;
//# sourceMappingURL=requirements.js.map
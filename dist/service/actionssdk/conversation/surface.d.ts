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
import * as Api from '../api/v2';
/** @public */
export declare type SurfaceCapability = 'actions.capability.AUDIO_OUTPUT' | 'actions.capability.SCREEN_OUTPUT' | 'actions.capability.MEDIA_RESPONSE_AUDIO' | 'actions.capability.WEB_BROWSER';
export declare class Surface {
    /** @public */
    capabilities: Capabilities;
    /** @hidden */
    constructor(surface?: Api.GoogleActionsV2Surface);
}
export declare class Capabilities {
    /**
     * List of surface capabilities of user device.
     * @public
     */
    list: Api.GoogleActionsV2Capability[];
    /** @hidden */
    constructor(list?: Api.GoogleActionsV2Capability[]);
    /**
     * Returns true if user device has a given surface capability.
     * @public
     */
    has(capability: SurfaceCapability): boolean;
}
export declare class AvailableSurfacesCapabilities {
    /** @public */
    surfaces: Surface[];
    /** @hidden */
    constructor(surfaces: Surface[]);
    /**
     * Returns true if user has an available surface which includes all given
     * capabilities. Available surfaces capabilities may exist on surfaces other
     * than that used for an ongoing conversation.
     * @public
     */
    has(capability: SurfaceCapability): boolean;
}
export declare class AvailableSurfaces {
    /** @public */
    list: Surface[];
    /** @public */
    capabilities: AvailableSurfacesCapabilities;
    /** @hidden */
    constructor(list: Api.GoogleActionsV2Surface[]);
}
export declare class Available {
    /** @public */
    surfaces: AvailableSurfaces;
    /** @hidden */
    constructor(surfaces?: Api.GoogleActionsV2Surface[]);
}

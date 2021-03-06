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
class Surface {
    /** @hidden */
    constructor(surface = {}) {
        this.capabilities = new Capabilities(surface.capabilities);
    }
}
exports.Surface = Surface;
class Capabilities {
    /** @hidden */
    constructor(list = []) {
        this.list = list;
    }
    /**
     * Returns true if user device has a given surface capability.
     * @public
     */
    has(capability) {
        return this.list.map(c => c.name).indexOf(capability) > -1;
    }
}
exports.Capabilities = Capabilities;
class AvailableSurfacesCapabilities {
    /** @hidden */
    constructor(surfaces) {
        this.surfaces = surfaces;
    }
    /**
     * Returns true if user has an available surface which includes all given
     * capabilities. Available surfaces capabilities may exist on surfaces other
     * than that used for an ongoing conversation.
     * @public
     */
    has(capability) {
        return this.surfaces.findIndex(surface => surface.capabilities.has(capability)) > -1;
    }
}
exports.AvailableSurfacesCapabilities = AvailableSurfacesCapabilities;
class AvailableSurfaces {
    /** @hidden */
    constructor(list) {
        this.list = list.map(surface => new Surface(surface));
        this.capabilities = new AvailableSurfacesCapabilities(this.list);
    }
}
exports.AvailableSurfaces = AvailableSurfaces;
class Available {
    /** @hidden */
    constructor(surfaces = []) {
        this.surfaces = new AvailableSurfaces(surfaces);
    }
}
exports.Available = Available;
//# sourceMappingURL=surface.js.map
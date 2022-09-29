/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import * as actionTypes from "../actions/actionTypes";

const initialState = {
    status: false,
    properties: [],
    actualProperties: [],
    alert: {},
    loading: false,
    loadText: ""
}

const telemetryReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_TELEMETRY_PROPERTIES:
            return {
                ...state,
                properties: action.payload,
                actualProperties: action.payload
            }
        case actionTypes.SET_TELEMETRY_PROPERTY: {
            const newProperties = state.properties.map((property) => {
                    return {
                        ...property,
                        fields: property.fields.map((field) => {
                            return field.field === action.payload ?
                                {
                                    ...field,
                                    isSet: !field.isSet
                                } : {...field}
                        })
                    }
                })
            return {
                ...state,
                properties: newProperties
            }
        }
        case actionTypes.SELECT_ALL_PROPERTIES: {
            const newProperties = state.properties.map((property) => {
                return {
                    ...property,
                    fields: property.fields.map((field) => {
                        return {
                            ...field,
                            isSet: action.payload
                        }
                    })
                }
            })
            return {
                ...state,
                properties: newProperties
            }
        }
        case actionTypes.SET_TELEMETRY_STATUS:
            return {
                ...state,
                status: action.payload
            }
        case actionTypes.SELECT_ALL_FROM_CATEGORY: {
            const newProperties = state.properties.map((property) => {
                return property.category === action.payload.category ? {
                    ...property,
                    fields: property.fields.map((field) => ({
                        ...field,
                        isSet: !action.payload.status
                    }))
                } : {...property}
                })
            return {
                ...state,
                properties: newProperties
            }
        }
        case actionTypes.TELEMETRY_CLOSE_ALERT: {
            return {
                ...state,
                alert: {
                    ...state.alert,
                    open: false
                }
            }
        }
        case actionTypes.TELEMETRY_OPEN_ALERT: {
            return {
                ...state,
                alert: {
                    ...action.payload
                }
            }
        }
        default:
            return state;
    }
};

export default telemetryReducer;
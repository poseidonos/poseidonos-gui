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

// HEADER COMPONENT
export const GET_IS_IBOF_OS_RUNNING = "GET_IS_IBOF_OS_RUNNING"

export const SAGA_GET_IS_IBOF_OS_RUNNING = "SAGA_GET_IS_IBOF_OS_RUNNING"

export const UPDATE_TIMESTAMP = "UPDATE_TIMESTAMP"

export const SAGA_UPDATE_TIMESTAMP = "SAGA_UPDATE_TIMESTAMP"

export const SAGA_GET_POS_INFO = "SAGA_GET_POS_INFO"

export const SET_POS_INFO = "SET_POS_INFO"

export const SAGA_START_IBOFOS = "START_IBOFOS"

export const SAGA_STOP_IBOFOS = "STOP_IBOFOS"

export const SET_POS_PROPERTY = "SET_POS_PROPERTY"

export const SET_IS_STATUS_CHECK_DONE = "SET_IS_STATUS_CHECK_DONE"

export const SAGA_SET_POS_PROPERTY = "SAGA_SET_POS_PROPERTY"

export const SAGA_GET_POS_PROPERTY = "SAGA_GET_POS_PROPERTY"

export const SAGA_RESET_IBOFOS = "RESET_IBOFOS"

export const SET_OPERATIONS_MESSAGE = "SET_OPERATIONS_MESSAGE"

// DASHBOARD PAGE
export const SAGA_FETCH_CHECK_TELEMETRY = "SAGA_FETCH_CHECK_TELEMETRY"

export const CLOSE_TELEMETRY_ALERT = "CLOSE_TELEMETRY_ALERT"

export const SET_SHOW_TELEMETRY_NOT_RUNNING = "SET_SHOW_TELEMETRY_NOT_RUNNING"

export const ENABLE_FETCHING_ALERTS = "ENABLE_FETCHING_ALERTS" // No SAGA action for this. Only applicable for sync call

export const FETCH_VOLUME_INFO = "FETCH_VOLUME_INFO"

export const SAGA_FETCH_VOLUME_INFO = "SAGA_FETCH_VOLUME_INFO"

export const FETCH_PERFORMANCE_INFO = "FETCH_PERFORMANCE_INFO"

export const SAGA_FETCH_PERFORMANCE_INFO = "SAGA_FETCH_PERFORMANCE_INFO"

export const FETCH_HARDWARE_HEALTH = "FETCH_HARDWARE_HEALTH"

export const SAGA_FETCH_HARDWARE_HEALTH = "SAGA_FETCH_HARDWARE_HEALTH"

export const SELECT_ARRAY = "SELECT_ARRAY"

export const SAGA_GET_ARRAY_INFO = "SAGA_GET_ARRAY_INFO"

export const GET_ARRAY_INFO = "GET_ARRAY_INFO"

export const SAGA_FETCH_HEALTH_STATUS = "SAGA_FETCH_HEALTH_STATUS"

export const FETCH_IPANDMAC_INFO = "FETCH_IPANDMAC_INFO"

export const SAGA_FETCH_IPANDMAC_INFO = "SAGA_FETCH_IPANDMAC_INFO"

// Storage Actions
export const CLEAR_VOLUMES = "CLEAR_VOLUMES"

export const FETCH_VOLUMES = "FETCH_VOLUMES"

export const SAGA_FETCH_VOLUMES = "SAGA_FETCH_VOLUMES"

export const START_FETCHING_VOLUMES = "START_FETCHING_VOLUMES"

export const STOP_FETCHING_VOLUMES = "STOP_FETCHING_VOLUMES"

export const FETCH_DEVICE_INFO = "FETCH_DEVICE_INFO"

export const SAGA_FETCH_DEVICE_INFO = "SAGA_FETCH_DEVICE_INFO"

export const FETCH_DEVICE_DETAILS = "FETCH_DEVICE_DETAILS"

export const SAGA_FETCH_DEVICE_DETAILS = "SAGA_FETCH_DEVICE_DETAILS"

export const SET_DEVICE_FETCHING = "SET_DEVICE_FETCHING"

export const SET_ARRAY_INFO_FETCHING = "SET_ARRAY_INFO_FETCHING"

export const SAGA_CREATE_DISK = "SAGA_CREATE_DISK"

export const SAGA_ATTACH_DISK = "SAGA_ATTACH_DISK"

export const SAGA_DETACH_DISK = "SAGA_DETACH_DISK"

export const SAGA_ADD_SPARE_DISK = "SAGA_ADD_SPARE_DISK"

export const SAGA_REMOVE_SPARE_DISK = "SAGA_REMOVE_SPARE_DISK"

export const SAGA_REPLACE_DEVICE = "SAGA_REPLACE_DEVICE"

export const FETCH_TRANSPORT_INFO = "FETCH_TRANSPORT_INFO"

export const SAGA_FETCH_TRANSPORT_INFO = "SAGA_FETCH_TRANSPORT_INFO"

export const SET_TRANSPORT_FETCHING = "SET_TRANSPORT_FETCHING"

export const SAGA_CREATE_TRANSPORT = "SAGA_CREATE_TRANSPORT"

export const SAVE_VOLUME = "SAVE_VOLUME"

export const SAGA_SAVE_VOLUME = "SAGA_SAVE_VOLUME"

export const SAGA_VOLUME_MOUNT_CHANGE = "SAGA_VOLUME_MOUNT_CHANGE"

export const DELETE_VOLUMES = "DELETE_VOLUMES"

export const SAGA_DELETE_VOLUMES = "SAGA_DELETE_VOLUMES"

export const FETCH_ARRAY = "FETCH_ARRAY"

export const SELECT_RAID = "SELECT_RAID"

export const SAGA_FETCH_ARRAY = "SAGA_FETCH_ARRAY"

export const CREATE_ARRAY = "CREATE_ARRAY"

export const SAGA_FETCH_CONFIG = "SAGA_FETCH_CONFIG"

export const FETCH_CONFIG = "FETCH_CONFIG"

export const SAGA_CREATE_ARRAY = "SAGA_CREATE_ARRAY"

export const SAGA_DELETE_ARRAY = "SAGA_DELETE_ARRAY"

export const SET_NO_ARRAY = "SET_NO_ARRAY"

export const SAGA_AUTO_CREATE_ARRAY = "SAGA_AUTO_CREATE_ARRAY"

export const SELECT_VOLUME = "SELECT_VOLUME"

export const EDIT_VOLUME = "EDIT_VOLUME"

export const ADD_VOLUME = "ADD_VOLUME"

export const CHANGE_VOLUME_FIELD = "CHANGE_VOLUME_FIELD"

export const CHANGE_MIN_TYPE = "CHANGE_MIN_TYPE"

export const CHANGE_RESET_TYPE = "CHANGE_RESET_TYPE"

export const SAGA_UPDATE_VOLUME = "SAGA_UPDATE_VOLUME"

export const SAGA_RESET_AND_UPDATE_VOLUME = "SAGA_RESET_AND_UPDATE_VOLUME"

export const FETCH_VOL_READ_BW = "FETCH_VOL_READ_BW"

export const FETCH_VOL_WRITE_BW = "FETCH_VOL_WRITE_BW"

export const FETCH_VOL_READ_IOPS = "FETCH_VOL_READ_IOPS"

export const FETCH_VOL_WRITE_IOPS = "FETCH_VOL_WRITE_IOPS"

export const FETCH_VOL_READ_LATENCY = "FETCH_VOL_READ_LATENCY"

export const FETCH_VOL_WRITE_LATENCY = "FETCH_VOL_WRITE_LATENCY"

export const SELECT_ALL_VOLUMES = "SELECT_ALL_VOLUMES"

export const STORAGE_SHOW_ALERT = "STORAGE_SHOW_ALERT"

export const STORAGE_CLOSE_ALERT = "STORAGE_CLOSE_ALERT"

export const STORAGE_START_LOADER = "STORAGE_START_LOADER"

export const STORAGE_STOP_LOADER = "STORAGE_STOP_LOADER"

export const START_LOADER = "START_LOADER"

export const STOP_LOADER = "STOP_LOADER"

export const FETCH_MAX_VOLUME_COUNT = "FETCH_MAX_VOLUME_COUNT"

export const SAGA_FETCH_MAX_VOLUME_COUNT = "SAGA_FETCH_MAX_VOLUME_COUNT"

export const TOGGLE_CREATE_VOLUME_BUTTON = "TOGGLE_CREATE_VOLUME_BUTTON"

export const SAGA_UNMOUNT_POS = "SAGA_UNMOUNT_POS"

export const SAGA_MOUNT_POS = "SAGA_MOUNT_POS"

export const SET_ARRAY = "SET_ARRAY"

export const SAGA_REBUILD_ARRAY = "SAGA_REBUILD_ARRAY"

// Create Volume Actions
export const RESET_INPUTS = "RESET_INPUTS"

export const CHANGE_INPUT = "CHANGE_INPUT"

export const UPDATE_SUBSYSTEM = "UPDATE_SUBSYSTEM"

export const TOGGLE_ADVANCE_CREATE_VOLUME_POPUP = "TOGGLE_ADVANCE_CREATE_VOLUME_POPUP"

export const SET_ACTIVE_STEP = "SET_ACTIVE_STEP"

export const SAGA_RESET_VOLUME_QOS = "SAGA_RESET_VOLUME_QOS"

// Alert Management
export const ALERT_MANAGEMENT_OPEN_ALERT_BOX = "ALERT_MANAGEMENT_OPEN_ALERT_BOX" // No SAGA action for this. Only applicable for sync call

//  Authentication
export const SET_IS_SAVING_CONFIG = "SET_IS_SAVING_CONFIG"

export const SET_IS_RESETTING_CONFIG = "SET_IS_RESETTING_CONFIG"

export const SET_SHOW_CONFIG = "SET_SHOW_CONFIG"

export const SET_IS_CONFIGURED = "SET_IS_CONFIGURED"

export const SET_IS_RESET_CONFIGURATION_FAILED = "SET_IS_RESET_CONFIGURATION_FAILED"

export const SAGA_CHECK_CONFIGURATION = "SAGA_CHECK_CONFIGURATION"

export const SAGA_RESET_CONFIGURATION = "SAGA_RESET_CONFIGURATION"

export const SAGA_CONFIGURE = "SAGA_CONFIGURE"

export const SET_CONFIGURATION_FAILED = "SET_CONFIGURATION_FAILED"

export const CHANGE_CREDENTIALS = "CHANGE_CREDENTIALS"

export const SAGA_LOGIN = "SAGA_LOGIN"

export const SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN"

export const RESET_IS_LOGGED_IN = "RESET_IS_LOGGED_IN"

export const SET_LOGIN_FAILED = "SET_LOGIN_FAILED"

// User Management
export const USER_MANAGEMENT_SET_USERS = "USER_MANAGEMENT_SET_USERS" // No SAGA action for this. Only applicable for sync call

export const USER_MANAGEMENT_OPEN_USER_BOX = "USER_MANAGEMENT_OPEN_USER_BOX" // No SAGA action for this. Only applicable for sync call

export const USER_MANAGEMENT_FETCH_USERS = "USER_MANAGEMENT_FETCH_USERS"

export const SAGA_USER_MANAGEMENT_FETCH_USERS = "SAGA_USER_MANAGEMENT_FETCH_USERS"

export const SAGA_USER_MANAGEMENT_UPDATE_USERS = "SAGA_USER_MANAGEMENT_UPDATE_USERS"

export const SAGA_USER_MANAGEMENT_DELETE_USERS = "SAGA_USER_MANAGEMENT_DELETE_USERS"

export const SAGA_USER_MANAGEMENT_ADD_NEW_USERS = "SAGA_USER_MANAGEMENT_ADD_NEW_USERS"

export const USER_MANAGEMENT_EDIT_USER = "USER_MANAGEMENT_EDIT_USER"

export const USER_MANAGEMENT_UPDATE_USER = "USER_MANAGEMENT_UPDATE_USER"

// Subsystem Actions
export const SAGA_FETCH_SUBSYSTEMS = "SAGA_FETCH_SUBSYSTEMS"

export const GET_SUBSYSTEMS = "GET_SUBSYSTEMS"

export const SHOW_SUBSYSTEM_ALERT = "SHOW_SUBSYSTEM_ALERT"

export const CLOSE_SUBSYSTEM_ALERT = "CLOSE_SUBSYSTEM_ALERT"

export const SAGA_CREATE_SUBSYSTEM = "SAGA_CREATE_SUBSYSTEM"

export const SAGA_ADD_LISTENER = "SAGA_ADD_LISTENER"

export const SAGA_DELETE_SUBSYSTEM = "SAGA_DELETE_SUBSYSTEM"

// Telemetry Actions
export const SAGA_FETCH_TELEMETRY_PROPERTIES = "SAGA_FETCH_TELEMETRY_PROPERTIES"

export const SET_TELEMETRY_PROPERTIES = "SET_TELEMETRY_PROPERTIES"

export const SET_TELEMETRY_PROPERTY = "SET_TELEMETRY_PROPERTY"

export const SAGA_DELETE_LISTENER = "SAGA_DELETE_LISTENER"

export const SET_TELEMETRY_STATUS = "SET_TELEMETRY_STATUS"

export const SELECT_ALL_FROM_CATEGORY = "SELECT_ALL_FROM_CATEGORY"

export const SELECT_ALL_PROPERTIES = "SELECT_ALL_PROPERTIES"

export const TELEMETRY_CLOSE_ALERT = "TELEMETRY_CLOSE_ALERT"

export const TELEMETRY_OPEN_ALERT = "TELEMETRY_OPEN_ALERT"

export const SAGA_START_TELEMETRY = "SAGA_START_TELEMETRY"

export const SAGA_STOP_TELEMETRY = "SAGA_STOP_TELEMETRY"

export const SAGA_SAVE_TELEMETRY_CONFIG = "SAGA_SAVE_TELEMETRY_CONFIG"

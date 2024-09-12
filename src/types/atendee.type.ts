export interface Attendee {
    id:                       string;
    printouts_history:        PrintoutsHistory[];
    account_id:               string;
    private_reference_number: string;
    printouts:                number;
    state_id:                 string;
    properties:               Properties;
    rol_id:                   string;
    checkedin_type:           string;
    event_id:                 string;
    rol:                      Rol;
    updated_at:               At;
    printouts_at:             Date;
    created_at:               At;
    checkedin_at:             At;
    checked_in:               boolean;
    _id:                      string;
    model_type:               string;
    activityProperties:       ActivityProperty[];
    user:                     User;
}

export interface ActivityProperty {
    activity_id:    string;
    checkedin_at:   Date;
    checkedin_type: string;
    checked_in:     boolean;
}

export interface At {
    seconds:     number;
    nanoseconds: number;
}

export interface PrintoutsHistory {
    printouts_at: Date;
    printouts:    number;
}

export interface Properties {
    email: string;
    names: string;
}

export interface Rol {
    updated_at: Date;
    created_at: Date;
    module:     string;
    _id:        string;
    type:       string;
    guard_name: string;
    name:       string;
}

export interface User {
    rol_evius:         string;
    initial_token:     string;
    _id:               string;
    is_admin:          boolean;
    email:             string;
    refresh_token:     string;
    picture:           string;
    updated_at:        Date;
    uid:               string;
    api_token:         string;
    created_at:        Date;
    password:          string;
    names:             string;
    confirmation_code: string;
}

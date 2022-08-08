type ConfigPropertySimple = string | number | boolean | null | undefined;

export interface ConfigObject {
    [key: string | number]:
        | ConfigPropertySimple
        | ConfigPropertySimple[]
        | ConfigObject
        | ConfigObject[];
}

export type ConfigProperty =
    | ConfigPropertySimple
    | ConfigPropertySimple[]
    | ConfigObject
    | ConfigObject[];

export type NonNullableConfigProperty =
    | NonNullable<ConfigPropertySimple>
    | NonNullable<ConfigPropertySimple>[]
    | NonNullable<ConfigObject>
    | NonNullable<ConfigObject>[];

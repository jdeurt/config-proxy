export class ConfigHandler<
    C extends Record<string, unknown>,
    T extends Record<string, unknown> = C
> implements ProxyHandler<T>
{
    private saveFunction: (data: C) => void;
    private targetData: T;
    private configData: C;

    constructor(data: T, saveFunction: (data: C) => void, configData?: C) {
        this.saveFunction = saveFunction;
        this.targetData = data;
        this.configData = configData ?? (data as C);
    }

    private save() {
        this.saveFunction(this.configData);
    }

    get(target: T, key: string): unknown {
        const value = target[key];

        if (typeof value === "object" && value !== null) {
            return new ConfigHandler<C, Record<string, unknown>>(
                value as Record<string, unknown>,
                this.saveFunction
            ).proxy();
        }

        return value;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(target: T, key: string, value: any): boolean {
        target[key as keyof T] = value;

        this.save();

        return true;
    }

    remove(target: T, key: string): boolean {
        delete target[key];

        this.save();

        return true;
    }

    keys(target: T): (keyof T)[] {
        return Object.keys(target);
    }

    has(target: T, key: string): boolean {
        return target[key] !== undefined;
    }

    proxy(): T {
        return new Proxy<T>(this.targetData, this);
    }
}

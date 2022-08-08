import { parse } from "node:path";
import { promises as fs, existsSync, writeFileSync } from "node:fs";
import { decode as decodeIni, encode as encodeIni } from "ini";
import { ConfigHandler } from "./config-handler";

export type ConfigProxyMode = "JSON" | "INI";

export class ConfigProxy<T extends Record<string, unknown>> {
    private mode: ConfigProxyMode;
    private path: string;

    constructor(path: string, mode: ConfigProxyMode = "INI") {
        this.mode = mode;
        this.path = path;
    }

    private save(data: T) {
        switch (this.mode) {
            case "INI":
                writeFileSync(this.path, encodeIni(data), "utf8");
                break;
            case "JSON":
                writeFileSync(this.path, JSON.stringify(data, null, 4), "utf8");
                break;
            default:
                throw new Error("Unsupported config mode!");
        }
    }

    async make(): Promise<T> {
        const parsedPath = parse(this.path);
        const configExists = existsSync(this.path);

        if (!configExists) {
            await fs.mkdir(parsedPath.dir, { recursive: true });

            await fs.writeFile(
                this.path,
                this.mode === "JSON" ? "{}" : "",
                "utf8"
            );
        }

        const strData = await fs.readFile(this.path, "utf8");

        switch (this.mode) {
            case "INI":
                try {
                    return new ConfigHandler<T>(
                        decodeIni(strData) as T,
                        this.save.bind(this)
                    ).proxy();
                } catch (err) {
                    throw new Error("Failed to parse INI config!");
                }

            case "JSON":
                try {
                    return new ConfigHandler<T>(
                        JSON.parse(strData),
                        this.save.bind(this)
                    ).proxy();
                } catch (err) {
                    throw new Error("Failed to parse JSON config!");
                }

            default:
                throw new Error("Unsupported config mode!");
        }
    }

    static async load(path: string, mode: ConfigProxyMode = "INI") {
        return new ConfigProxy(path, mode).make();
    }
}

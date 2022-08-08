import { existsSync, readFileSync, rmSync } from "node:fs";
import { decode as decodeIni } from "ini";

import { ConfigProxy } from "../src";

interface INIConfig {
    [key: string]: unknown;

    group?: {
        option1?: boolean;
        option2?: string;
        option3?: number;
        option4?: string[];
    };
    base?: string;
}

describe("INI config handler", () => {
    const cfgPath = __dirname + "/__fixtures__/cfg.ini";

    let cfg: ConfigProxy<INIConfig>;

    beforeEach(() => {
        cfg = new ConfigProxy(cfgPath, "INI");
    });

    afterAll(() => {
        rmSync(__dirname + "/__fixtures__", { recursive: true });
    });

    it("should create a config file and initialize it if one does not exist", async () => {
        await cfg.make();

        const configFileExists = existsSync(cfgPath);

        expect(configFileExists).toBe(true);
    });

    it("should allow you to assign properties to the config", async () => {
        const proxied = await cfg.make();

        proxied.base = "Hello from config.base!";

        const actual = decodeIni(readFileSync(cfgPath, "utf8"));

        expect(actual.base).toEqual(proxied.base);
    });

    it("should allow you to assign to and read nested properties from the config", async () => {
        const proxied = await cfg.make();

        proxied.group = {};
        proxied.group.option1 = true;
        proxied.group.option2 = "Hello from config.group.option2!";
        proxied.group.option4 = [];
        proxied.group.option4.push("Hello");
        proxied.base = "Hello from config.base!";

        const actual = decodeIni(readFileSync(cfgPath, "utf8"));

        expect(actual).toEqual(proxied);
    });
});

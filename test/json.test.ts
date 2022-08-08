import { existsSync, readFileSync, rmSync } from "node:fs";

import { ConfigProxy } from "../src";

interface JSONConfig {
    [key: string]: unknown;

    group?: {
        option1?: boolean;
        option2?: string;
        option3?: number;
        option4?: boolean[];
    };
    base?: string;
}

describe("JSON config handler", () => {
    const cfgPath = __dirname + "/__fixtures__/cfg.json";

    let cfg: ConfigProxy<JSONConfig>;

    beforeEach(() => {
        cfg = new ConfigProxy(cfgPath, "JSON");
    });

    afterAll(() => {
        rmSync(__dirname + "/__fixtures__", { recursive: true });
    });

    it("should create a config file and initialize it if one does not exist", async () => {
        await cfg.make();

        const configFileExists = existsSync(cfgPath);

        expect(configFileExists).toBe(true);

        const data = JSON.parse(readFileSync(cfgPath, "utf8"));

        expect(data).toEqual({});
    });

    it("should allow you to assign properties to the config", async () => {
        const proxied = await cfg.make();

        proxied.base = "Hello from config.base!";

        const actual = JSON.parse(readFileSync(cfgPath, "utf8"));

        expect(actual.base).toEqual(proxied.base);
    });

    it("should allow you to assign to and read nested properties from the config", async () => {
        const proxied = await cfg.make();

        proxied.group = {};
        proxied.group.option1 = true;
        proxied.group.option2 = "Hello from config.group.option2!";
        proxied.base = "Hello from config.base!";

        const actual = JSON.parse(readFileSync(cfgPath, "utf8"));

        expect(actual).toEqual(proxied);
    });
});

import { createEcmaScriptPlugin } from "@bufbuild/protoplugin";
import type { Schema } from "@bufbuild/protoplugin/ecmascript";
import { version } from "../../mtmaiapi-backup/package.json";

export const genServiceMetaData = createEcmaScriptPlugin({
  name: "protoc-gen-twirp-es",
  version: `v${String(version)}`,
  generateTs: (schema: Schema) => {
    const f = schema.generateFile("metaData22.ts");
    for (const file of schema.files) {
      // const f = schema.generateFile("descriptions/" + file.name + ".ts");
      const { Message, JsonValue } = schema.runtime;
      f.preamble(file);

      const servicesData = {} as any;
      for (const service of file.services) {
        const oneService = {
          methods: {},
        } as any;
        for (const method of service.methods) {
          oneService.methods[method.name] = {
            idempotency: method.idempotency,
            name: method.name,
            // "inputName": method.input.,
            protoName: method.proto.name,
          };
        }
        servicesData[service.name] = oneService;
      }
      f.print(
        "export const serviceMetaData = " +
          JSON.stringify(servicesData, null, 2),
      );
    }
  },
});
// prettier-ignore

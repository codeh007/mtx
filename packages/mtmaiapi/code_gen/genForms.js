import { createEcmaScriptPlugin } from "@bufbuild/protoplugin";
import { version } from "../package.json";
export const genServiceMetaData = createEcmaScriptPlugin({
    name: "protoc-gen-twirp-es",
    version: `v${String(version)}`,
    generateTs: (schema) => {
        const f = schema.generateFile("forms.ts");
        for (const file of schema.files) {
            const { Message, JsonValue } = schema.runtime;
            f.preamble(file);
            const servicesData = {};
            for (const msg of file.messages) {
                for (const f of msg.fields) {
                }
            }
            for (const service of file.services) {
                const oneService = {
                    methods: {}
                };
                for (const method of service.methods) {
                    oneService.methods[method.name] = {
                        "idempotency": method.idempotency,
                        "name": method.name,
                        "protoName": method.proto.name,
                    };
                }
                servicesData[service.name] = oneService;
            }
            f.print("export const serviceMetaData = " + JSON.stringify(servicesData, null, 2));
        }
    },
});

import { createEcmaScriptPlugin } from "@bufbuild/protoplugin";
import { version } from "../package.json";
export const genDescription = createEcmaScriptPlugin({
    name: "protoc-gen-twirp-es",
    version: `v${String(version)}`,
    generateTs: (schema) => {
        for (const file of schema.files) {
            const f = schema.generateFile("descriptions/" + file.name + ".ts");
            const { Message, JsonValue } = schema.runtime;
            f.preamble(file);
            for (const enumeration of file.enums) {
                f.print(`// generating enums from ${file.name}`);
                f.print();
            }
            for (const message of file.messages) {
                f.print(`// generating messages from ${file.name}, ${message}`);
                for (const field of message.fields) {
                    f.print(`// generating fieldPresence: ${field.getFeatures().fieldPresence}, ${message}`);
                    f.print(`// proto.label: ${field.proto.label}, ${field.proto.options}`);
                }
            }
            for (const service of file.services) {
                f.print `// generating services from ${file.name}`;
                f.print();
                for (const method of service.methods) {
                    const methodValues = JSON.stringify({
                        serviceName: service.name,
                        "method.idempotency": method.idempotency,
                        "method.name": method.name,
                        "method.input.name": method.input.name,
                        "method.proto.name": method.proto.name,
                    }, null, 2);
                    f.print `/*${methodValues}*/`;
                    f.print();
                }
            }
        }
    },
});

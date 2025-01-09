/// <reference lib="dom" />
/**
 * 解决 bun 下的错误： ReferenceError: Can't find variable: TextDecoderStream
 * 参考： https://github.com/oven-sh/bun/issues/5648
 *
 * 注意：可能有bug，因为我看到过出现乱码的情况，
 */
globalThis.TextDecoderStream = class {
	#handle: TextDecoder;

	#transform = new TransformStream({
		transform: (chunk, controller) => {
			const value = this.#handle.decode(chunk, { stream: true });

			if (value) {
				controller.enqueue(value);
			}
		},
		flush: (controller) => {
			const value = this.#handle.decode();
			if (value) {
				controller.enqueue(value);
			}

			controller.terminate();
		},
	});

	constructor(encoding = "utf-8", options: TextDecoderOptions = {}) {
		this.#handle = new TextDecoder(encoding, options);
	}

	get encoding() {
		return this.#handle.encoding;
	}

	get fatal() {
		return this.#handle.fatal;
	}

	get ignoreBOM() {
		return this.#handle.ignoreBOM;
	}

	get readable() {
		return this.#transform.readable;
	}

	get writable() {
		return this.#transform.writable;
	}

	get [Symbol.toStringTag]() {
		return "TextDecoderStream";
	}
};

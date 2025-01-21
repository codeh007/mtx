

import { MemoryVectorStore } from "langchain/vectorstores/memory";
const vectorStore = new MemoryVectorStore(new SomeEmbeddingModel());
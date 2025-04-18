import { createClient, createConfig } from "@hey-api/client-fetch";
import { getLlm } from "../llm/llm";

interface MtmaiClientOpts {
  url: string;
  tenant?: string;
  payload?: any;
}
export class MtmaiClient {
  private client: ReturnType<typeof createClient>;
  private payload: any;
  constructor(private opts: MtmaiClientOpts) {
    this.client = createClient(
      createConfig({
        baseUrl: "https://colab-gomtm.yuepa8.com",
      }),
    );
  }

  getMtmClient() {
    return this.client;
  }

  getTenandId() {
    return "fakeTanantId";
  }

  getDefaultLlm() {
    return getLlm();
  }
  getPayload() {
    return this.payload;
  }
  setPayload(payload: any) {
    this.payload = payload;
  }
}

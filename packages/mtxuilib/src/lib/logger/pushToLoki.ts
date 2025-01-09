// 文档： https://grafana.com/docs/loki/latest/reference/loki-http-api/
export async function pushLoki(...data: any[]) {
  const LokiUsername = process.env.LOKI_USERNAME;
  const Lokipassword = process.env.LOKI_PASSWORD;

  const url = process.env.LOKI_URL;

  const logdata = {
    streams: [
      {
        stream: {
          label: "value",
          level: "info",
          logger: "example",
          custom: "value",
        },
        values: data.map((x) => [
          (Date.now() * 1000000).toString(),
          JSON.stringify(x),
        ]),
      },
    ],
  };

  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(LokiUsername + ":" + Lokipassword)}`,
    },
    body: JSON.stringify(logdata),
  }).then((x) => x.text());

  console.log("日志推送到 grafana.net(loki)", data, result);
}

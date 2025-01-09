const mtqueueApi = "http://172.17.0.1:8383/api.queue";
export async function mtQueueAdd(name: string, payload) {
  const result = await fetch(`${mtqueueApi}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

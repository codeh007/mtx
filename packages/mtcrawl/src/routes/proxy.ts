import express from "express";

export const proxyRouter = express.Router();

proxyRouter.all("/proxy", async (req, res) => {
  const { url } = req.body;

  try {
    const postData = {
      country_code: "US",
      state: "New York",
      city: "New York",
      asn: 11,
      type_id: 1,
      proxy_type_id: 2,
      name: null,
      server_port_type_id: 1,
      count: 1,
      ttl: 1,
    };
    const url = "https://api.asocks.com/v2/proxy/create-port";
    const url2 = "https://api.asocks.com/user/balance";
    const response = await fetch(url2, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 6qXrpZiVEVROt5Jkmibk2J41c8EzSEPG`,
      },
      // body: JSON.stringify(postData),
    });
    // const data = await response.json();
    const text = await response.text();
    res.json(text);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

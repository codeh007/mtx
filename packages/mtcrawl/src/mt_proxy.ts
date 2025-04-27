async function asocks_create_proxy() {
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

  const response = await fetch("https://api.asocks.com/api/proxy/create", {
    method: "POST",
    body: JSON.stringify(postData),
  });
  const data = await response.json();
}

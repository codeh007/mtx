/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { fetchMiddleWithCache } from "./fetchMiddleWithCache"


test('fetch 缓存正常情况', async () => {
  const fetchFn = jest.fn(fetch)

  const fetchWithCache = fetchMiddleWithCache(fetchFn)
  const count = 10

  for (let i = 0; i < count; i++) {
    fetchFn.mockReturnValueOnce(Promise.resolve(new Response("abc", {

    })))
    const res = await fetchWithCache("https://www.bing.com", {
      headers: {
        authorization: "token2",
      }
    })
    const content = await res.text()
    expect(content).toContain("abc")
  }
  expect(fetchFn.mock.calls.length).toBe(1)
})

test('fetch 非200响应不做缓存', async () => {
  const fetchFn = jest.fn(fetch)
  const fetchWithCache = fetchMiddleWithCache(fetchFn)
  const count = 10

  for (let i = 0; i < count; i++) {
    fetchFn.mockReturnValueOnce(Promise.resolve(
      new Response("some content", {
        status: 500,
      })))
    const res = await fetchWithCache("https://www.bing.com", {
      headers: {
        authorization: "token1",
      }
    })
    const content = await res.text()
    expect(content).toContain("some conten")
  }
  expect(fetchFn.mock.calls.length).toBe(count)
})

test('fetch 缓存不同的url', async () => {
  const fetchFn = jest.fn(fetch)
  const count = 10
  const fetchWithCache = fetchMiddleWithCache(fetchFn)
  for (let i = 0; i < count; i++) {
    fetchFn.mockReturnValueOnce(Promise.resolve(new Response("abc", {

    })))
    const res = await fetchWithCache(`https://www.bing.com/${i}`, {
      headers: {
        authorization: "token2",
      }
    })
    expect(await res.text()).toContain("abc")
  }
  expect(fetchFn.mock.calls.length).toBe(10)
})

import { OauthService } from "@canva/connect-api-ts";
import { createClient } from "@canva/connect-api-ts/client";

const mockClient = createClient({
  baseUrl: "https://api.canva.com",
  headers: { Authorization: "Basic aaaaaaaa" },
});

describe("OAuth service body serialization", () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("exchangeAccessToken", () => {
    it("serializes the request body as application/x-www-form-urlencoded", async () => {
      mockFetch.mockResolvedValue(
        new Response(
          JSON.stringify({
            access_token: "tok",
            refresh_token: "ref",
            token_type: "Bearer",
            expires_in: 3600,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );

      await OauthService.exchangeAccessToken({
        client: mockClient,
        body: {
          grant_type: "authorization_code",
          code: "test-code",
          code_verifier: "test-verifier",
          redirect_uri: "http://localhost:3001/oauth/redirect",
        },
      });

      const request = mockFetch.mock.calls[0][0] as Request;
      const body = await request.text();
      const parsed = Object.fromEntries(new URLSearchParams(body));

      expect(parsed.grant_type).toBe("authorization_code");
      expect(parsed.code).toBe("test-code");
      expect(parsed.code_verifier).toBe("test-verifier");
      expect(parsed.redirect_uri).toBe("http://localhost:3001/oauth/redirect");
      // Regression guard: plain object .toString() returns "[object Object]"
      expect(body).not.toBe("[object Object]");
    });
  });

  describe("revokeTokens", () => {
    it("serializes the request body as application/x-www-form-urlencoded", async () => {
      mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

      await OauthService.revokeTokens({
        client: mockClient,
        body: {
          client_id: "my-client-id",
          client_secret: "my-client-secret",
          token: "test-refresh-token",
        },
      });

      const request = mockFetch.mock.calls[0][0] as Request;
      const body = await request.text();
      const parsed = Object.fromEntries(new URLSearchParams(body));

      expect(parsed.client_id).toBe("my-client-id");
      expect(parsed.token).toBe("test-refresh-token");
      // Regression guard: plain object .toString() returns "[object Object]"
      expect(body).not.toBe("[object Object]");
    });
  });
});

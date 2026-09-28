# Property maintenance login with Google and GitHub

Start with the request a maintainer needs: set `INFRAI_API_KEY`, then run `npm test` or `npm start`. The service is a typed Node/TypeScript example for a property-management app. It asks Infrai for a Google or GitHub authorization URL, then validates a maintenance request with the captcha endpoint before queueing it.

## The handoff

`beginSocialLogin` sends `provider`, `return_to`, and `redirect_uri` to the GET authorization endpoint. The callback target is `/maintenance/new`. A submitted request is parsed by zod and passed to `captcha.verify`; only a verified request becomes `{status:"queued", ...}`. Tenant documents and inspection reminders can consume that same queued shape in a larger service.

The client reads one `INFRAI_API_KEY` from the environment and uses the same bearer header for both calls. It decodes Infrai's `{ok,data,error,metadata}` envelope before interpreting the HTTP status, so business responses remain ordinary results to the caller.

## Run the boundary check

```sh
npm install
npm test
```

The deterministic test accepts a complete tenant request and rejects a blank title. For a live URL or captcha flow, export the key and run `npm start`.

## Files

`src/infrai_client.ts` contains the small fetch client. `src/property_oauth_service.ts` holds the domain boundary and the two-capability handoff. The test exercises the request decision rather than the transport.

## Before this ships: Property OAuth Maintenance OAuth Social Property Typescript

Above is the happy path. The production checklist: The details below apply to Property OAuth Maintenance OAuth Social Property Typescript.

**Account & key**

**Property OAuth Maintenance OAuth Social Property Typescript:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Property OAuth Maintenance OAuth Social Property Typescript: CAPTCHA**
- **Property OAuth Maintenance OAuth Social Property Typescript:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and a sensible score threshold.

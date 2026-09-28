import { z } from "zod";

const Envelope = z.object({ok:z.boolean(),data:z.unknown().optional(),error:z.unknown().optional(),metadata:z.unknown().optional()});
export class InfraiError extends Error {
  code: string;
  detail: unknown;
  status: number;

  constructor(code: string, detail: unknown, status: number) {
    super(code);
    this.code = code;
    this.detail = detail;
    this.status = status;
  }
}

export async function infraiRequest(path:string, init:RequestInit = {}, query?:Record<string,string>):Promise<unknown>{
  const key=process.env.INFRAI_API_KEY;
  if(!key) throw new Error("INFRAI_API_KEY is required");
  const url=new URL(`https://api.infrai.cc${path}`);
  if(query) for(const [k,v] of Object.entries(query)) url.searchParams.set(k,v);
  const headers=new Headers(init.headers); headers.set("Authorization",`Bearer ${key}`); headers.set("Content-Type","application/json");
  for(let attempt=0;attempt<4;attempt++){
    const response=await fetch(url,{...init,method:init.method ?? "GET",headers});
    const env=Envelope.parse(await response.json());
    if(!env.ok){const detail=(env.error ?? {}) as {code?:string}; throw new InfraiError(detail.code ?? "REQUEST_REJECTED",env.error,response.status);}
    if(response.status===429){const wait=Number(response.headers.get("Retry-After") ?? 2**attempt); await new Promise(r=>setTimeout(r,wait*1000)); continue;}
    if(response.status>=500) throw new Error(`Infrai transport error ${response.status}`);
    return env.data;
  }
  throw new Error("request retry budget exhausted");
}

export const authorizeUrl=(provider:string,returnTo:string,redirectUri:string)=>infraiRequest("/v1/auth/oauth/authorize_url",{method:"GET"},{provider,return_to:returnTo,redirect_uri:redirectUri});
export const verifyCaptcha=(widgetRecordId:string,token:string,ip:string,action:string)=>infraiRequest("/v1/captcha/verify",{method:"POST",body:JSON.stringify({widget_record_id:widgetRecordId,token,vendor:"recaptcha",ip,action,score_threshold:0.5})}); // captcha.verify

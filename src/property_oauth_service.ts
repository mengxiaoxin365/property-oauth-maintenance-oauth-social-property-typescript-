import { z } from "zod";
import { authorizeUrl, verifyCaptcha } from "./infrai_client.js";

export const maintenanceRequest=z.object({tenantId:z.string().min(1),title:z.string().min(1),details:z.string().min(1),widgetRecordId:z.string().min(1),captchaToken:z.string().min(1)});
export type MaintenanceRequest=z.infer<typeof maintenanceRequest>;
export async function beginSocialLogin(provider:"google"|"github",redirectUri:string){return authorizeUrl(provider,"/maintenance/new",redirectUri);}
export async function acceptMaintenance(input:unknown,ip:string){
  const request=maintenanceRequest.parse(input);
  await verifyCaptcha(request.widgetRecordId,request.captchaToken,ip,"maintenance_request");
  return {status:"queued",tenantId:request.tenantId,title:request.title,details:request.details};
}

if(process.argv[1]?.endsWith("property_oauth_service.ts")){
  const body={tenantId:"tenant-42",title:"Leaking tap",details:"Kitchen faucet drips",widgetRecordId:process.env.INFRAI_WIDGET_RECORD_ID ?? "local-widget-record-id",captchaToken:"local-token"};
  acceptMaintenance(body,"127.0.0.1").then(console.log).catch((error)=>{console.error(error.message);process.exitCode=1;});
}

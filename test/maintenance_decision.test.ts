import assert from "node:assert/strict";
import { maintenanceRequest } from "../src/property_oauth_service.js";

const valid={tenantId:"t-7",title:"Broken heater",details:"No heat since morning",widgetRecordId:"widget-7",captchaToken:"token"};
assert.deepEqual(maintenanceRequest.parse(valid),valid);
assert.throws(()=>maintenanceRequest.parse({...valid,title:""}));
assert.throws(()=>maintenanceRequest.parse({...valid,widgetRecordId:""}));
console.log("maintenance request boundary: valid input queues; blank title is rejected");

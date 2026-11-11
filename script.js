const vendors = [
  {id:"abc",name:"ABC Payroll",base:29,employee:7,time:3.5,delivery:15},
  {id:"cde",name:"CDE Payroll",base:35,employee:6,time:2.5,delivery:16},
  {id:"fgh",name:"FGH Payroll",base:37,employee:5,time:4,delivery:17},
  {id:"ijk",name:"IJK Payroll",base:40,employee:6,time:5,delivery:19},
  {id:"lmn",name:"LMN Payroll",base:49,employee:6,time:2.3,delivery:10},
  {id:"opq",name:"OPQ Payroll",base:49,employee:6,time:5,delivery:18},
  {id:"rst",name:"RST Payroll",base:50,employee:7,time:3.2,delivery:14},
  {id:"uvw",name:"UVW Payroll",base:40,employee:8,time:2.6,delivery:13},
  {id:"xyz",name:"XYZ Payroll",base:50,employee:8,time:2.7,delivery:10.5}
];
const frequencies = {
  weekly:{label:"Weekly",runs:52},
  biweekly:{label:"Biweekly",runs:26},
  semimonthly:{label:"Semimonthly",runs:24},
  monthly:{label:"Monthly",runs:12},
  quarterly:{label:"Quarterly",runs:4}
};
const MARGIN = 0.015;
let selectedId = null;
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
const num = id => Math.max(0,Number($(id).value)||0);
const state = () => ({
  client:$("clientName").value.trim(),
  contact:$("contactName").value.trim(),
  email:$("clientEmail").value.trim(),
  employees:Math.max(1,Math.floor(num("employees"))),
  frequency:$("frequency").value,
  timekeeping:$("timekeeping").checked,
  delivery:$("delivery").checked
});
function calculate(v,s){
  const deliveryMonthly = s.delivery ? v.delivery * frequencies[s.frequency].runs / 12 : 0;
  const base = v.base;
  const employee = v.employee * s.employees;
  const time = s.timekeeping ? v.time * s.employees : 0;
  const vendorMonthly = base + employee + time + deliveryMonthly;
  const clientMonthly = vendorMonthly / (1-MARGIN); // 1.5% gross margin on selling price
  return {base,employee,time,deliveryMonthly,vendorMonthly,clientMonthly,profitMonthly:clientMonthly-vendorMonthly,annualClient:clientMonthly*12,annualVendor:vendorMonthly*12,annualProfit:(clientMonthly-vendorMonthly)*12};
}
function renderVendors(){
  const s=state();
  const ranked=vendors.map(v=>({v,c:calculate(v,s)})).sort((a,b)=>a.c.vendorMonthly-b.c.vendorMonthly);
  const best=ranked[0].v.id;
  $("vendorRows").innerHTML=vendors.map(v=>{
    const c=calculate(v,s), chosen=selectedId===v.id;
    return `<tr class="${chosen?"selected":""} ${v.id===best?"best":""}">
      <td>${v.name}</td><td>${money(v.base)}</td><td>${money(v.employee)}</td><td>${money(v.time)}</td><td>${money(v.delivery)}</td>
      <td class="cost">${money(c.vendorMonthly)}</td><td><button class="select-btn ${chosen?"active":""}" data-vendor="${v.id}">${chosen?"Selected":"Select"}</button></td></tr>`;
  }).join("");
  document.querySelectorAll("[data-vendor]").forEach(btn=>btn.addEventListener("click",()=>selectVendor(btn.dataset.vendor)));
  if(selectedId) renderPricing();
}
function breakdownHTML(c){
  return [
    ["Vendor base fee",c.base],
    ["Employee fees",c.employee],
    [`Timekeeping (${state().timekeeping?"included":"not included"})`,c.time],
    [`Delivery (${state().delivery?frequencies[state().frequency].runs+" runs/year":"not included"})`,c.deliveryMonthly],
    ["Total vendor cost per month",c.vendorMonthly],
    ["Client price per month (1.5% gross margin)",c.clientMonthly]
  ].map((r,i)=>`<div class="breakdown-line ${i===5?"total":""}"><span>${r[0]}</span><strong>${money(r[1])}</strong></div>`).join("");
}
function selectVendor(id){selectedId=id;renderVendors();$("emptyState").hidden=true;$("pricingArea").hidden=false;}
function renderPricing(){
  const v=vendors.find(x=>x.id===selectedId);if(!v)return;
  const s=state(),c=calculate(v,s);
  $("selectedVendorName").textContent=v.name;
  $("selectedVendorMeta").textContent=`${s.employees} employees · ${frequencies[s.frequency].label} payroll · ${frequencies[s.frequency].runs} payroll runs per year`;
  $("monthlyCost").textContent=money(c.vendorMonthly);
  $("clientMonthly").textContent=money(c.clientMonthly);
  $("clientAnnual").textContent=money(c.annualClient);
  $("annualProfit").textContent=money(c.annualProfit);
  $("breakdown").innerHTML=breakdownHTML(c);
  fillProposal(v,s,c);
}
function fillProposal(v,s,c){
  $("pClientName").textContent=s.client||"Client Company";
  $("pContact").textContent=[s.contact,s.email].filter(Boolean).join(" · ");
  $("pDate").textContent=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  $("pFrequency").textContent=frequencies[s.frequency].label;
  $("pEmployees").textContent=String(s.employees);
  $("pVendor").textContent=v.name;
  $("pServices").textContent=[s.timekeeping?"Timekeeping included":"Timekeeping not included",s.delivery?"Delivery included":"Delivery not included"].join(" · ");
  $("pBreakdown").innerHTML=breakdownHTML(c);
  $("pMonthly").textContent=money(c.clientMonthly);
  $("pAnnual").textContent=money(c.annualClient);
}
function refresh(){renderVendors();if(!selectedId){$("emptyState").hidden=false;$("pricingArea").hidden=true;}}
["employees","frequency","timekeeping","delivery"].forEach(id=>$(id).addEventListener("input",refresh));
["clientName","contactName","clientEmail"].forEach(id=>$(id).addEventListener("input",()=>{if(selectedId)renderPricing();}));
$("printBtn").addEventListener("click",()=>{
  if(!selectedId)return;
  if(!$("clientName").value.trim()){alert("Please enter the client company name before printing the proposal.");$("clientName").focus();return;}
  window.print();
});
$("clearBtn").addEventListener("click",()=>{selectedId=null;refresh();});
$("year").textContent=new Date().getFullYear();
refresh();
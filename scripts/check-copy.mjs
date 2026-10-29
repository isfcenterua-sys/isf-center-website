import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
export async function checkCopyNumber(root){
  const source=fs.readFileSync(path.join(root,'assets/contacts.js'),'utf8');
  for(const success of [true,false]){
    let click,focused=false,selected=false;
    const classes=new Set(),status={textContent:'old status'},field={hidden:true,focus(){focused=true;},select(){selected=true;}};
    const box={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},querySelector:selector=>selector==='input'?field:status};
    const button={dataset:{copied:'Number copied',manual:'Copy the selected number'},closest:()=>box,addEventListener:(_,handler)=>{click=handler;}};
    vm.runInNewContext(source,{document:{querySelectorAll:()=>[button]},navigator:{clipboard:{writeText:async phone=>{assert.equal(phone,'+380957332967');if(!success)throw Error('clipboard unavailable');}}},setTimeout:()=>0});
    await click();
    if(success){assert.equal(status.textContent,'Number copied');assert.ok(classes.has('is-copied'));assert.equal(field.hidden,true);}
    else{assert.equal(status.textContent,'Copy the selected number');assert.ok(!classes.has('is-copied'));assert.equal(field.hidden,false);assert.ok(focused&&selected);}
  }
  return {successCase:'PASS',failureFallback:'PASS'};
}

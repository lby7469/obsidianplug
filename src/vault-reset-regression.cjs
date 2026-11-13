const assert=require('node:assert/strict');
const {testModule}=require('./test-module.cjs');
const {harness,TFile,delay}=require('./test-harness.cjs');
const {VaultResetFlow}=testModule('vault-reset.ts');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const proof={confirmationId:'synthetic-confirmation-0001',storageEpoch:0,files:1,usedBytes:10,message:'synthetic',confirmationPhrase:'清空云端笔记'};
function fixture(){
  const t=harness({files:[new TFile('private.md','local unsynced note')]});const p=t.instance;
  p.settings.autoSync=true;p.settings.stateStorageEpoch=0;p.settings.state={'private.md':{hash:'old',remoteRevision:'old'}};
  p.refreshAccount=async()=>p.settings.account;p.setStatus=()=>{};
  const calls=[];p.authorizedRequest=async(route,options)=>{calls.push([route,options]);if(route.endsWith('/prepare'))return proof;return {ok:true,storageEpoch:1,account:{id:'account-a',usedBytes:0,quotaBytes:100000000,storageEpoch:1}};};
  return {...t,p,calls};
}
(async()=>{
  const t=fixture(),flow=new VaultResetFlow(t.p);eq(t.p.vaultResetting,true);
  await t.p.sync(true);eq(t.metrics.requests,0);
  await assert.rejects(flow.confirm('清空云端笔记'));checks++;
  t.p.syncing=true;const preparing=flow.prepare();await delay(60);eq(t.calls.length,0);eq(t.p.settings.autoSync,false);
  t.p.syncing=false;await preparing;eq(t.calls.length,1);
  await assert.rejects(flow.confirm('wrong'));checks++;eq(t.calls.length,1);
  await flow.confirm('清空云端笔记');eq(t.p.settings.stateStorageEpoch,1);eq(Object.keys(t.p.settings.state),[]);eq(t.p.settings.autoSync,false);
  eq(t.store.get('private.md').content.toString(),'local unsynced note');eq(t.metrics.reads,0);eq(t.p.settings.syncAllFolders,true);
  await assert.rejects(flow.confirm('清空云端笔记'));checks++;eq(t.calls.length,2);eq(flow.close(),true);eq(t.p.vaultResetting,false);
  const cancelled=fixture(),cf=new VaultResetFlow(cancelled.p);await cf.prepare();cf.close();await assert.rejects(cf.confirm('清空云端笔记'));checks++;eq(cancelled.calls.length,1);eq(cancelled.p.settings.autoSync,false);
  const switched=fixture(),sf=new VaultResetFlow(switched.p);await sf.prepare();switched.p.authEpoch++;
  await assert.rejects(sf.confirm('清空云端笔记'));checks++;eq(switched.calls.length,1);sf.close();
  const failed=fixture(),ff=new VaultResetFlow(failed.p);await ff.prepare();failed.p.authorizedRequest=async()=>{throw Error('synthetic connection lost');};
  await assert.rejects(ff.confirm('清空云端笔记'));checks++;eq(failed.p.settings.autoSync,false);eq(failed.p.settings.state['private.md'].hash,'old');
  await assert.rejects(ff.confirm('清空云端笔记'));checks++;ff.close();
  const saving=fixture(),saveFlow=new VaultResetFlow(saving.p);saving.p.saveSettings=async()=>{throw Error('cannot persist pause');};
  await assert.rejects(saveFlow.prepare());checks++;eq(saving.calls.length,0);saveFlow.close();
  const busy=fixture(),bf=new VaultResetFlow(busy.p);let release;busy.p.authorizedRequest=()=>new Promise(r=>release=r);
  const request=bf.prepare();await delay(10);eq(bf.close(),false);await assert.rejects(bf.prepare());checks++;release(proof);await request;bf.close();
  const stale=fixture(),staleFlow=new VaultResetFlow(stale.p);await staleFlow.prepare();stale.p.settings.serverUrl='https://another.example.test';
  await assert.rejects(staleFlow.confirm('清空云端笔记'));checks++;eq(stale.calls.length,1);staleFlow.close();
  console.log(JSON.stringify({passed:true,checks,suite:'vault-reset',productionChanged:false,localNotesPreserved:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});

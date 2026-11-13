const assert=require('node:assert/strict');
const {testModule}=require('./test-module.cjs');
const {reconcileStorageEpoch}=testModule('storage-epoch.ts');
const {harness,TFile}=require('./test-harness.cjs');
let checks=0;const equal=(a,b)=>{assert.deepEqual(a,b);checks++;};
(async()=>{
  const settings={state:{'note.md':{hash:'old',remoteRevision:'old'}},lastSyncAt:'before'};
  equal(reconcileStorageEpoch(settings,{storageEpoch:0}),false);equal(settings.state['note.md'].hash,'old');
  equal(reconcileStorageEpoch(settings,{storageEpoch:1}),true);equal(Object.keys(settings.state),[]);equal(settings.lastSyncAt,'');equal(settings.autoSync,false);
  equal(reconcileStorageEpoch(settings,{storageEpoch:1}),false);assert.throws(()=>reconcileStorageEpoch(settings,{storageEpoch:0}));checks++;
  assert.throws(()=>reconcileStorageEpoch(settings,{storageEpoch:-1}));checks++;assert.throws(()=>reconcileStorageEpoch(settings,{storageEpoch:'2'}));checks++;
  // Run the real compiled plugin against a memory vault. A reset refresh may
  // cancel an in-flight pass; it must never modify/delete the local note.
  const t=harness({files:[new TFile('note.md','unsynced local text')]});
  const plugin=t.plugin||t.instance;
  assert.ok(plugin,'harness plugin');
  plugin.settings.stateStorageEpoch=0;plugin.settings.state={'note.md':{hash:'old',remoteRevision:'old'}};
  const result=reconcileStorageEpoch(plugin.settings,{storageEpoch:1});equal(result,true);
  equal(Object.keys(plugin.settings.state),[]);
  equal(t.store.get('note.md').content.toString(),'unsynced local text');
  equal(t.metrics.reads,0);
  console.log(JSON.stringify({passed:true,checks,suite:'storage-epoch',network:false}));
})().catch(error=>{console.error(error);process.exitCode=1;});

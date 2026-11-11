import type {Account,PluginSettings} from "./plugin-types";
// A server-side reset starts a new baseline. This never touches vault files.
export function reconcileStorageEpoch(settings:PluginSettings,account:Account):boolean {
  const next=account.storageEpoch;
  if(next===undefined)return false;
  if(!Number.isSafeInteger(next)||next<0)throw new Error("仓库状态异常，已停止同步");
  const previous=settings.stateStorageEpoch||0;
  if(next<previous)throw new Error("服务器仓库状态回退，请联系管理员，已停止同步");
  const changed=next!==previous;
  if(changed){settings.state={};settings.lastSyncAt="";}
  settings.stateStorageEpoch=next;
  return changed;
}

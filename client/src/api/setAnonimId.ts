import { StorageHelper } from "../utils/StorageHelper";
import { ANONIM_UUID } from "../utils/constants";
import { registerAnonim } from "./registerAnonim";

export const setAnonimId = async () => {
  const anonimUUID = StorageHelper.get(ANONIM_UUID);

  if (!anonimUUID) {
    StorageHelper.save(ANONIM_UUID, "pending...");
    const res = await registerAnonim();
    if (res.ok) {
      StorageHelper.save(ANONIM_UUID, res.uuid);
    } else {
      StorageHelper.delete(ANONIM_UUID);
    }
  }
};

export type DynamicDataUUID = number;

export interface DynamicDataModeStore {
    generateUUID: () => DynamicDataUUID;
    enterDynamicBlock: (id: DynamicDataUUID) => void;
    exitDynamicBlock: () => void;
    currentDynamicBlock: () => DynamicDataUUID;
    getBlockDataVersion: (id: DynamicDataUUID) => number;
}

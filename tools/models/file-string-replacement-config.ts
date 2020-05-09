
export interface StringReplacementSet {
  currStr: string,
  nextStr: string,
}

export interface StringReplacementData {
  filePath: string,
  replacementSets: StringReplacementSet[]
}

export interface FileStringReplacementConfig {
  rootFolder: string,
  sets: StringReplacementData[]
}

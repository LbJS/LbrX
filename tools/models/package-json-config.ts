
export interface PackageJsonConfig {
  propertiesToDelete: string[],
  propertiesToAddOrUpdate: {
    key: string,
    value: string,
  }[]
}

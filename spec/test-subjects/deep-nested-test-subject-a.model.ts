
export class DeepNestedTestSubjectA {
	public stringValue: string | null = null
	public numberValue: number | null = null
	public booleanValue: boolean | null = null
	public dateValue: Date | null = null
	public stringsList: (string | null)[] | null = null
	public objectList: ({ value: string, date: Date } | null)[] | null = null
}

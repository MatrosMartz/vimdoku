export interface TabSchema {
	key: string
	label: string | ConstructorOfATypedSvelteComponent
	panel: ConstructorOfATypedSvelteComponent
}

```ts
const getContains = Match.create<
	| Array<PropertyKey>
	| Set<PropertyKey>
	| Map<PropertyKey>
	| BiMap<Array<[PropertyKey, PropertyKey]> | Record<PropertyKey, unknown>>,
	(val: PropertyKey) => boolean
>()
	.addCase(Array, arr => Array.prototype.includes.bind(arr))
	.addCase(Set, Map, setLike => setLike.has)
	.addCase(BiMap, biMap => biMap.containsKey)
	.addCase(Case.notNull.typeOf('object'), obj => Object.hasOwn.bind(obj))
	.default(() => {
		throw new Error('other ist invalid')
	})
	.done()

const arr = [1, 2, 3]

const contains = getContains(arr)
```

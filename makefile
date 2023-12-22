fmt:
	npm run fmt
	npm run lint:js
	npm run lint:css

check:
	npm run check & npm run test & wait
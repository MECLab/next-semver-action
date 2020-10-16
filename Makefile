
format:
	./node_modules/.bin/prettier --write **/*.ts

format-check:
	./node_modules/.bin/prettier --check **/*.ts

build:
	./node_modules/.bin/eslint src/**/*.ts
	./node_modules/.bin/tsc -p .

package:
	./node_modules/.bin/ncc build --source-map --license licenses.txt

test-unit:
	npx jest src/__tests__/unit/

# local development utility commands
ready: format build package

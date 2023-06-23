.PHONY: test
test:
	deno test --coverage=./cov --unstable --allow-all

.PHONY: lint
lint:
	deno fmt --check *.ts
	deno lint --unstable

.PHONY: install-udd
install-udd:
	deno install -rf --allow-read=. --allow-write=. --allow-net https://deno.land/x/udd/main.ts

.PHONY: outdated
outdated:
	udd denops/@ddc-sources/iced.ts

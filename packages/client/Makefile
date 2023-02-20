up:
	rm -rf ./dist && yarn build && docker compose up  --build --force-recreate -d
up-lattice:
	rm -rf ./dist && yarn build:lattice && docker compose up  --build --force-recreate -d
staging:
	rm -rf ./dist && yarn build:staging && docker compose -f ./docker-compose.staging.yml up --build --force-recreate -d

deploy-staging:
	 git pull && rm -rf ./dist && yarn build:staging && docker compose -f ./docker-compose.staging.yml up --build --force-recreate -d
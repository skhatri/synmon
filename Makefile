

ps:
	@docker-compose ps

up:
	@docker-compose up -d


down:
	@docker-compose down

test:
	@docker stop cypress
	@docker-compose up -d


log:
	firebase functions:log

deploy:
	firebase deploy --only functions:thirtySecondsURL

deployall:
	firebase deploy
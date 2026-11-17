# Code Review Exercise

Spend no more than 10 minutes reviewing `backend/src/legacy/legacy.ts`.

You do not need to fix the code. Add brief notes below describing issues you noticed and what you would improve.

## Notes

- User ID and Role passed as body/input can bypass role authentication, should come from JWT
- DB find function uses == which can allow the comparison between two different variables, e.g 12 == "12"
- Failed operations does not throw an error, returns an "ok" status and a message, but better if using built in exceptions to throw the appropriate error (NotFound/BadRequest). 
- Better to use enums instead of hardcoded statuses 

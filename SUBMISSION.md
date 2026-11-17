# Submission Notes

## Summary

Briefly describe what you implemented.

Implemented inspection functionality allowing users to create, complete and view inspections based on user role. Created appropriate Rest APIs, and Frontend for the inspections feature. 

## Assumptions

List any assumptions you made. For example: duration unit, status transition rules, or UI scope.

- A simple table was used to display inspections. Which also has a create button for managers, and a complete button for inspectors.
- Minutes was used for duration as it seemed the most intuitive. Inspections don't usually last hours especially based from the given data, locations seemed like locations within a workplace.
- Creation of inspection is simply a create and assign to an inspector. Based the functionality on the instructions, since Location and other important data are only given during the completion which is done by the inspector. 
- Did not create a DTO for create-inspection, used id and role provided by jwt for authorization.

## Trade-offs / Known Limitations

List what you deliberately left out or simplified because of the time box.

- Structured Responses
- Centralized Error Handling
- No pagination, filtering, sorting
- No unit tests

## Security Notes

Briefly explain how role-based access and Inspector ownership checks are enforced.

- All inspection endpoints use JwtAuthGuard and RolesGuard. POST and assign are Manager only, complete is Inspector only, and GET allows both roles but results vary based on their role.
- Role and user Id come from jwt
- Used DTOs to define and validate incoming requests

## AI Usage

State whether you used AI tools. If yes, briefly explain:

- Which tool(s) you used
  - Claude
- What you used them for
  - For validating output, clarification of my ideas, and creating initial draft/boilerplate for the files i am working on.
- How you reviewed or changed the generated output
  - I verified if the given output was within the scope and left out any unnecessary generated code.
  - I ensured that it was following the provided architecture.

## What I Would Improve With More Time

List the next improvements you would make.
- Create additional response DTOs
- Add confirm step before assigning inspector
- Provide search, filtering, sorting, pagination functionality to table
- Add an edit and delete functionality for Managers
- Create migrations instead of relying on synchronize to create the tables
- Add unit tests 
- Improve frontend UI
- Cover more edge cases
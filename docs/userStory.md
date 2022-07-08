## Decision Maker
A web app that helps groups of friends to vote on a preferred choice (using ranked voting), for example: "What movie should we see next Friday?".

### User Story
* a user create a poll with multiple choices
 -each choice have 
  --a title
  --optional description
 -the creator must enter an email

* when (a poll is finished being created) 
 -the user is given two links: 
  --an administrative link (which lets them access the results) and 
  --a submission link (which the user sends to their friends)
 -the links are sent to the creator via email (using mailgun)

* when (a user visits the poll he created thruough the submission_link) 
  -see a list of the choices for that poll 
   --they enter their name if required

* the user
  -rank the choices (by drag and drop, or some other method) and 
  -then submits the poll

* each time a submission is received, 
  -the creator is notified with an email 
   which includes 
  --the administrative link and 
  --a link to the results

* the results are ranked using 
    the Borda Count method: https://en.wikipedia.org/wiki/Borda_count

note: 
1. The only way to access the polls or see the results is via administrative links
2. This app does not follow the typical user authentication process: voters don't need to register or log in.


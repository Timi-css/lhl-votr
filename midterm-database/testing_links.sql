SELECT poll_link, polls.id, users.email
FROM polls
JOIN users on user_id = users.id;

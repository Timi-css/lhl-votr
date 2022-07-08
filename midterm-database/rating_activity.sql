SELECT activity, Sum(rating) as total_rating
FROM submission
GROUP BY activity
ORDER BY Sum(rating) DESC;
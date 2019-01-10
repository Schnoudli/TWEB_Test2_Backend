# TWEB_Test2_Backend

``npm install``
``npm run dev``

And everything should be fine

You can access these endpoints : 
- URL/api/movies
- URL/api/movies/<pageNumber>
- URL/auth/register
- URL/auth/login

To register : ``curl -X POST -H "Content-type: application/json" -d '{"username": "test", "password": "test"}' http://localhost:4000/auth/register``
To login : ``curl -X POST -H "Content-type: application/json" -d '{"username": "admin", "password": "admin"}' http://localhost:4000/auth/login``

Check the Google Form for more details about the implementation and the problems encountered.
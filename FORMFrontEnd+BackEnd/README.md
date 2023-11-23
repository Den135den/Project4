# DDP Project

## Front-end UI
### Login fields
#### Inputs
`login`

`password`
#### Button
`login`

>action: POST ‘localhost:5000/login'

>body:

<pre>
{
  "login": "some_login",
  "password": "some_password",
}
</pre>


### Register fields
#### Inputs
`username`

`login`

`password`

`password confirmation`
#### Button
`register`

>action: POST ‘localhost:5000/register'

>body:

<pre>
{
  "username": "some_username",
  "login": "some_login",
  "password": "some_password",
}
</pre>

>if response status 200 -> redirect to login page
### Link
`Already have an account`

>action: redirect to login page
# Back-end
### Database: MongoDB
#### Database Users table (document) fields:

`username`

`login`

`password`

# Back-end (API)

## Login

### Request

`POST /login`
### Response
if user in db and credits is ok:
<pre>
{
  status: 200
}
</pre>
if user in db but wrong password:
<pre>
{
  status: 401
}
</pre>
some else reason (temporary)
<pre>
{
  status: 400
}
</pre>

## Register
### Request

`POST /register`

### Response
if successful writed to db:
<pre>
{
  status: 200
}
</pre>
if user alreadu registerred:
<pre>
{
  status: 409
}
</pre>
some else reason (temporary)
<pre>
{
  status: 400
}
</pre>

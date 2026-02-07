## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
GET /profile/view
PATCH /profile/edit
PATH /profile/password

## connectionRouter
POST /request/send/ignored/:userId
POST /request/send/interested/:userId
POST /request/reveiw/rejected/:requestId
POST /request/reveiw/accepted/:requestId

## userRouter
GET /user/requests/received
GET /user/feed
GET /user/connections

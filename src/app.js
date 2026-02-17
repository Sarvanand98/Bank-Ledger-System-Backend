import express, { urlencoded } from 'express'
import authRouter from './routes/auth.route.js'
import accountRoute from './routes/account.route.js'
import transactionRoute from './routes/transaction.route.js'
import CookieParser from 'cookie-parser';
const app=express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(CookieParser())

app.use('/api/auth',authRouter)
app.use('/api/account',accountRoute)
app.use('/api/transaction',transactionRoute)

export default app;
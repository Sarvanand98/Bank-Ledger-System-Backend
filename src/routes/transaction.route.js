import express from 'express'
import authmiddleware from '../middleware/auth.middleware.js'
import transactioncontroller from '../controllers/transaction.controller.js'
const router=express.Router();


router.post('/',authmiddleware.authmiddleware,transactioncontroller.create)
router.post('/system/intial-funds',authmiddleware.authSystemUserMiddleware,transactioncontroller.createInitialFund)

export default router;
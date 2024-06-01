let router = require('express').Router();

const authRouter = require('./authRouter.js');
const productRouter = require('./productRouter.js');
const orderRouter = require('./orderRouter.js');
const adminRouter = require('./adminRouter.js');

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/admin', adminRouter);

module.exports = router
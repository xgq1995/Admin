import SMERouter from 'sme-router'
import activeMiddleware from './active'
import * as indexController from '../controllers/index'
import * as positionController from '../controllers/position'

const router = new SMERouter('router-view')

router.route('/', indexController.render)
router.route('/position', positionController.render)
router.route('/position:id', positionController.render)

router.route('*', (req, res, next) => {
  res.redirect('/') // 实际上协助跳转到 / 路由上
})


router.use(activeMiddleware)